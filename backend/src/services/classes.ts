import { supabase } from './supabase'
import type { ClassRow, ClassInsert, ClassUpdate, StudentRow } from './supabase'
import type { Class, Student, CreateClassRequest, UpdateClassRequest } from '../types/api'

// Utility functions
function classRowToClass(row: ClassRow): Class {
    const result: Class = {
        id: row.id,
        name: row.name,
    };

    if (row.description !== null) {
        result.description = row.description;
    }

    return result;
}

function studentRowToStudent(row: StudentRow, classIds: string[] = []): Student {
    return {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        classIds,
    };
}

export class ClassesService {
    static async getAll(): Promise<Class[]> {
        const { data, error } = await supabase
            .from('classes')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            throw new Error(`Failed to fetch classes: ${error.message}`);
        }

        return data.map((row: ClassRow) => classRowToClass(row));
    }

    static async getById(id: string): Promise<Class | null> {
        const { data, error } = await supabase
            .from('classes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw new Error(`Failed to fetch class: ${error.message}`);
        }

        return classRowToClass(data);
    }

    static async create(request: CreateClassRequest): Promise<Class> {
        const insertData: ClassInsert = {
            name: request.name,
            description: request.description || null,
        };

        const { data, error } = await supabase
            .from('classes')
            .insert(insertData)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to create class: ${error.message}`);
        }

        return classRowToClass(data);
    }

    static async update(id: string, request: UpdateClassRequest): Promise<Class> {
        const updateData: ClassUpdate = {};
        if (request.name !== undefined) updateData.name = request.name;
        if (request.description !== undefined) updateData.description = request.description || null;
        updateData.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('classes')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to update class: ${error.message}`);
        }

        return classRowToClass(data);
    }

    static async delete(id: string): Promise<void> {
        const { error } = await supabase.from('classes').delete().eq('id', id);

        if (error) {
            throw new Error(`Failed to delete class: ${error.message}`);
        }
    }

    static async getStudents(classId: string): Promise<Student[]> {
        const { data: assignmentsData, error: assignmentsError } = await supabase
            .from('class_assignments')
            .select(`
        student_id,
        students!inner(*)
      `)
            .eq('class_id', classId);

        if (assignmentsError) {
            throw new Error(`Failed to fetch class students: ${assignmentsError.message}`);
        }

        // Get all assignments for these students to build complete classIds arrays
        const studentIds = assignmentsData.map((item) => item.student_id);

        if (studentIds.length === 0) {
            return [];
        }

        const { data: allAssignmentsData, error: allAssignmentsError } = await supabase
            .from('class_assignments')
            .select('student_id, class_id')
            .in('student_id', studentIds);

        if (allAssignmentsError) {
            throw new Error(`Failed to fetch student assignments: ${allAssignmentsError.message}`);
        }

        // Group assignments by student ID
        const assignmentsByStudent = (allAssignmentsData ?? []).reduce((acc, assignment) => {
            if (!acc[assignment.student_id]) {
                acc[assignment.student_id] = [];
            }
            acc[assignment.student_id]!.push(assignment.class_id);
            return acc;
        }, {} as Record<string, string[]>);

        return assignmentsData.map((item) =>
            studentRowToStudent(item.students, assignmentsByStudent[item.student_id] || [])
        );
    }
}
