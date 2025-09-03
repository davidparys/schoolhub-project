// Database row types
export interface StudentRow {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
}

export interface ClassRow {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClassAssignmentRow {
  id: string;
  student_id: string;
  class_id: string;
  assigned_at: string;
}

// Application models
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  classIds: string[];
}

export interface Class {
  id: string;
  name: string;
  description?: string;
}

// API request/response types
export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
}

export interface UpdateStudentRequest {
  firstName?: string;
  lastName?: string;
}

export interface CreateClassRequest {
  name: string;
  description?: string;
}

export interface UpdateClassRequest {
  name?: string;
  description?: string;
}

export interface AssignStudentToClassRequest {
  studentId: string;
  classId: string;
}

// Utility functions to convert between database and application models
export function studentRowToStudent(row: StudentRow, classIds: string[] = []): Student {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    classIds,
  };
}

export function classRowToClass(row: ClassRow): Class {
  const result: Class = {
    id: row.id,
    name: row.name,
  };

  if (row.description !== null) {
    result.description = row.description;
  }

  return result;
}

// API response wrappers
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  totalCount: number;
  page: number;
  limit: number;
}

// UI state types
export interface UiState {
  isLoading: boolean;
  showStudentDialog: boolean;
  showClassDialog: boolean;
  showAssignDialog: boolean;
  selectedClassId?: string;
  selectedStudentIds: string[];
  language: 'en' | 'pl';
}
