import { z } from 'zod'

// Input validation schemas
export const CreateStudentSchema = z.object({
    firstName: z.string().min(1).max(64),
    lastName: z.string().min(1).max(64),
})

export const UpdateStudentSchema = z.object({
    firstName: z.string().min(1).max(64).optional(),
    lastName: z.string().min(1).max(64).optional(),
})

export const CreateClassSchema = z.object({
    name: z.string().min(1).max(128),
    description: z.string().optional(),
})

export const UpdateClassSchema = z.object({
    name: z.string().min(1).max(128).optional(),
    description: z.string().optional(),
})

export const AssignStudentToClassSchema = z.object({
    studentId: z.string().uuid(),
    classId: z.string().uuid(),
})

// Response schemas
export const StudentSchema = z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    classIds: z.array(z.string().uuid()),
})

export const ClassSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().optional(),
})

export const ApiResponseSchema = z.object({
    data: z.any(),
    error: z.string().optional(),
})

export const ErrorResponseSchema = z.object({
    error: z.string(),
    message: z.string().optional(),
    code: z.number().optional(),
})

// Type exports
export type CreateStudentRequest = z.infer<typeof CreateStudentSchema>
export type UpdateStudentRequest = z.infer<typeof UpdateStudentSchema>
export type CreateClassRequest = z.infer<typeof CreateClassSchema>
export type UpdateClassRequest = z.infer<typeof UpdateClassSchema>
export type AssignStudentToClassRequest = z.infer<typeof AssignStudentToClassSchema>
export type Student = z.infer<typeof StudentSchema>
export type Class = z.infer<typeof ClassSchema>
export type ApiResponse<T> = {
    data: T
    error?: string
}
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
