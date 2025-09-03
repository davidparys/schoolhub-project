export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            students: {
                Row: {
                    id: string;
                    first_name: string;
                    last_name: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    first_name: string;
                    last_name: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    first_name?: string;
                    last_name?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            classes: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    description?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    description?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            class_assignments: {
                Row: {
                    id: string;
                    student_id: string;
                    class_id: string;
                    assigned_at: string;
                };
                Insert: {
                    id?: string;
                    student_id: string;
                    class_id: string;
                    assigned_at?: string;
                };
                Update: {
                    id?: string;
                    student_id?: string;
                    class_id?: string;
                    assigned_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'class_assignments_student_id_fkey';
                        columns: ['student_id'];
                        isOneToOne: false;
                        referencedRelation: 'students';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'class_assignments_class_id_fkey';
                        columns: ['class_id'];
                        isOneToOne: false;
                        referencedRelation: 'classes';
                        referencedColumns: ['id'];
                    }
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
