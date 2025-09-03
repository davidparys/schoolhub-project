/**
 * API Service Layer - Now uses the standalone backend API instead of direct Supabase calls
 * 
 * This file provides a unified interface for the frontend to interact with the backend API.
 * It replaces the previous direct Supabase integration with HTTP API calls to our Deno backend.
 */

import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import type {
    Student,
    Class,
    CreateStudentRequest,
    UpdateStudentRequest,
    CreateClassRequest,
    UpdateClassRequest,
} from '../components/models';

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Error handling utility
class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public code?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Create Axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        // no need to hide the key as it is going to be a public api anyway


    },
});

// Request interceptor - can be used to add auth tokens, etc.
apiClient.interceptors.request.use(
    (config) => {
        // You can add authentication headers here if needed
        // config.headers.Authorization = `Bearer ${getAuthToken()}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // If the response has a data property, return it; otherwise return the whole response
        if (response.data && 'data' in response.data) {
            return { ...response, data: response.data.data };
        }
        return response;
    },
    (error: AxiosError) => {
        let errorMessage = 'An error occurred';
        let errorCode: string | undefined;
        let status = 0;

        if (error.response) {
            // Server responded with error status
            status = error.response.status;
            const errorData = error.response.data as any;
            errorMessage = errorData?.message || errorData?.error || error.message;
            errorCode = errorData?.code;
        } else if (error.request) {
            // Request was made but no response received
            errorMessage = 'Network error: No response from server';
            status = 0;
        } else {
            // Something else happened
            errorMessage = error.message;
            status = 0;
        }

        throw new ApiError(errorMessage, status, errorCode);
    }
);

// Generic API request wrapper
async function apiRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
): Promise<T> {
    try {
        const response = await apiClient.request({
            method,
            url: endpoint,
            data,
        });

        return response.data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            error instanceof Error ? error.message : 'Unknown error occurred',
            0
        );
    }
}

// Students API
export class StudentsAPI {
    static async getAll(): Promise<Student[]> {
        return apiRequest<Student[]>('GET', '/students');
    }

    static async getById(id: string): Promise<Student | null> {
        try {
            return await apiRequest<Student>('GET', `/students/${id}`);
        } catch (error) {
            if (error instanceof ApiError && error.status === 404) {
                return null;
            }
            throw error;
        }
    }

    static async create(request: CreateStudentRequest): Promise<Student> {
        return apiRequest<Student>('POST', '/students', request);
    }

    static async update(id: string, request: UpdateStudentRequest): Promise<Student> {
        return apiRequest<Student>('PUT', `/students/${id}`, request);
    }

    static async delete(id: string): Promise<void> {
        await apiRequest<void>('DELETE', `/students/${id}`);
    }

    static async assignToClass(studentId: string, classId: string): Promise<void> {
        await apiRequest<void>('POST', `/students/${studentId}/assign-class`, { classId });
    }

    static async removeFromClass(studentId: string, classId: string): Promise<void> {
        await apiRequest<void>('DELETE', `/students/${studentId}/classes/${classId}`);
    }
}

// Classes API
export class ClassesAPI {
    static async getAll(): Promise<Class[]> {
        return apiRequest<Class[]>('GET', '/classes');
    }

    static async getById(id: string): Promise<Class | null> {
        try {
            return await apiRequest<Class>('GET', `/classes/${id}`);
        } catch (error) {
            if (error instanceof ApiError && error.status === 404) {
                return null;
            }
            throw error;
        }
    }

    static async create(request: CreateClassRequest): Promise<Class> {
        return apiRequest<Class>('POST', '/classes', request);
    }

    static async update(id: string, request: UpdateClassRequest): Promise<Class> {
        return apiRequest<Class>('PUT', `/classes/${id}`, request);
    }

    static async delete(id: string): Promise<void> {
        await apiRequest<void>('DELETE', `/classes/${id}`);
    }

    static async getStudents(classId: string): Promise<Student[]> {
        return apiRequest<Student[]>('GET', `/classes/${classId}/students`);
    }
}

// Export ApiError for use in components
export { ApiError };
