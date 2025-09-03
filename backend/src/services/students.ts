import { supabase } from './supabase'
import type { StudentRow, StudentInsert, StudentUpdate } from './supabase'
import type { Student, CreateStudentRequest, UpdateStudentRequest } from '../types/api'

// Utility function to convert database row to API model
function studentRowToStudent(row: StudentRow, classIds: string[] = []): Student {
    return {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        classIds,
    };
}

export class StudentsService {
    static async getAll(): Promise<Student[]> {
        // First, get all students
        const { data: studentsData, error: studentsError } = await supabase
            .from('students')
            .select('*')
            .order('last_name', { ascending: true });

        if (studentsError) {
            throw new Error(`Failed to fetch students: ${studentsError.message}`);
        }

        // Then get all class assignments
        const { data: assignmentsData, error: assignmentsError } = await supabase
            .from('class_assignments')
            .select('student_id, class_id');

        if (assignmentsError) {
            throw new Error(`Failed to fetch class assignments: ${assignmentsError.message}`);
        }

        // Group assignments by student ID
        const assignmentsByStudent = (assignmentsData ?? []).reduce((acc, assignment) => {
            if (!acc[assignment.student_id]) {
                acc[assignment.student_id] = [];
            }
            acc[assignment.student_id]!.push(assignment.class_id);
            return acc;
        }, {} as Record<string, string[]>);

        // Convert to application model
        return studentsData.map((row: StudentRow) =>
            studentRowToStudent(row, assignmentsByStudent[row.id] || [])
        );
    }

    static async getById(id: string): Promise<Student | null> {
        const { data: studentData, error: studentError } = await supabase
            .from('students')
            .select('*')
            .eq('id', id)
            .single();

        if (studentError) {
            if (studentError.code === 'PGRST116') return null; // Not found
            throw new Error(`Failed to fetch student: ${studentError.message}`);
        }

        // Get class assignments for this student
        const { data: assignmentsData, error: assignmentsError } = await supabase
            .from('class_assignments')
            .select('class_id')
            .eq('student_id', id);

        if (assignmentsError) {
            throw new Error(`Failed to fetch student assignments: ${assignmentsError.message}`);
        }

        const classIds = assignmentsData.map((assignment) => assignment.class_id);
        return studentRowToStudent(studentData, classIds);
    }

    static async create(request: CreateStudentRequest): Promise<Student> {
        const insertData: StudentInsert = {
            first_name: request.firstName,
            last_name: request.lastName,
        };

        const { data, error } = await supabase
            .from('students')
            .insert(insertData)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to create student: ${error.message}`);
        }

        return studentRowToStudent(data, []);
    }

    static async update(id: string, request: UpdateStudentRequest): Promise<Student> {
        const updateData: StudentUpdate = {};
        if (request.firstName !== undefined) updateData.first_name = request.firstName;
        if (request.lastName !== undefined) updateData.last_name = request.lastName;
        updateData.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('students')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to update student: ${error.message}`);
        }

        // Get updated class assignments
        const { data: assignmentsData, error: assignmentsError } = await supabase
            .from('class_assignments')
            .select('class_id')
            .eq('student_id', id);

        if (assignmentsError) {
            throw new Error(`Failed to fetch student assignments: ${assignmentsError.message}`);
        }

        const classIds = assignmentsData.map((assignment) => assignment.class_id);
        return studentRowToStudent(data, classIds);
    }

    static async delete(id: string): Promise<void> {
        const { error } = await supabase.from('students').delete().eq('id', id);

        if (error) {
            throw new Error(`Failed to delete student: ${error.message}`);
        }
    }

    static async assignToClass(studentId: string, classId: string): Promise<void> {
        const { error } = await supabase.from('class_assignments').insert({
            student_id: studentId,
            class_id: classId,
        });

        if (error) {
            throw new Error(`Failed to assign student to class: ${error.message}`);
        }
    }

    static async removeFromClass(studentId: string, classId: string): Promise<void> {
        const { error } = await supabase
            .from('class_assignments')
            .delete()
            .eq('student_id', studentId)
            .eq('class_id', classId);

        if (error) {
            throw new Error(`Failed to remove student from class: ${error.message}`);
        }
    }
}
