import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Database types based on our schema
export interface DatabaseStudent {
    id: string;
    first_name: string;
    last_name: string;
    created_at: string;
    updated_at: string;
}

export interface DatabaseClass {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface DatabaseClassAssignment {
    id: string;
    student_id: string;
    class_id: string;
    created_at: string;
}

// API service functions
export const studentsAPI = {
    async getAll() {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('last_name', { ascending: true });

        if (error) throw error;
        return data;
    },

    async create(student: { first_name: string; last_name: string }) {
        const { data, error } = await supabase
            .from('students')
            .insert([student])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, updates: { first_name?: string; last_name?: string }) {
        const { data, error } = await supabase
            .from('students')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async getClassAssignments(studentId: string) {
        const { data, error } = await supabase
            .from('class_assignments')
            .select('class_id, classes(id, name)')
            .eq('student_id', studentId);

        if (error) throw error;
        return data;
    }
};

export const classesAPI = {
    async getAll() {
        const { data, error } = await supabase
            .from('classes')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    },

    async create(classData: { name: string; description?: string }) {
        const { data, error } = await supabase
            .from('classes')
            .insert([classData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id: string, updates: { name?: string; description?: string }) {
        const { data, error } = await supabase
            .from('classes')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('classes')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async getStudents(classId: string) {
        const { data, error } = await supabase
            .from('class_assignments')
            .select('student_id, students(id, first_name, last_name)')
            .eq('class_id', classId);

        if (error) throw error;
        return data;
    }
};

export const assignmentsAPI = {
    async assignStudentToClass(studentId: string, classId: string) {
        const { data, error } = await supabase
            .from('class_assignments')
            .insert([{ student_id: studentId, class_id: classId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async removeStudentFromClass(studentId: string, classId: string) {
        const { error } = await supabase
            .from('class_assignments')
            .delete()
            .eq('student_id', studentId)
            .eq('class_id', classId);

        if (error) throw error;
    },

    async assignMultipleStudentsToClass(studentIds: string[], classId: string) {
        const assignments = studentIds.map(studentId => ({
            student_id: studentId,
            class_id: classId
        }));

        const { data, error } = await supabase
            .from('class_assignments')
            .insert(assignments)
            .select();

        if (error) throw error;
        return data;
    }
};
