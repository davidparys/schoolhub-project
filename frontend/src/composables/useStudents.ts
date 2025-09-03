import { useQuery, useMutation, useQueryCache } from '@pinia/colada'
import { StudentsAPI } from '../services/api'
import type { CreateStudentRequest, UpdateStudentRequest } from '../components/models'

// Query keys for consistent cache management
export const STUDENTS_QUERY_KEY = 'students'
export const STUDENT_QUERY_KEY = (id: string) => ['student', id]

// Fetch all students
export function useStudents() {
    return useQuery({
        key: [STUDENTS_QUERY_KEY],
        query: () => StudentsAPI.getAll(),
    })
}

// Fetch single student
export function useStudent(id: string) {
    return useQuery({
        key: STUDENT_QUERY_KEY(id),
        query: () => StudentsAPI.getById(id),
        enabled: !!id,
    })
}

// Create student mutation
export function useCreateStudent() {
    const queryCache = useQueryCache()

    return useMutation({
        mutation: (request: CreateStudentRequest) => StudentsAPI.create(request),
        onSettled: () => {
            // Invalidate and refetch students list
            void queryCache.invalidateQueries({ key: [STUDENTS_QUERY_KEY] })
        },
    })
}

// Update student mutation
export function useUpdateStudent() {
    const queryCache = useQueryCache()

    return useMutation({
        mutation: ({ id, request }: { id: string; request: UpdateStudentRequest }) =>
            StudentsAPI.update(id, request),
        onSettled: (updatedStudent) => {
            // Invalidate students list to reflect changes
            void queryCache.invalidateQueries({ key: [STUDENTS_QUERY_KEY] })
            if (updatedStudent) {
                // Invalidate the specific student as well
                void queryCache.invalidateQueries({ key: STUDENT_QUERY_KEY(updatedStudent.id) })
            }
        },
    })
}

// Delete student mutation
export function useDeleteStudent() {
    const queryCache = useQueryCache()

    return useMutation({
        mutation: (id: string) => StudentsAPI.delete(id),
        onSettled: (_, __, deletedId) => {
            // Invalidate students list
            void queryCache.invalidateQueries({ key: [STUDENTS_QUERY_KEY] })
            void queryCache.invalidateQueries({ key: STUDENT_QUERY_KEY(deletedId) })
        },
    })
}

// Assign student to class mutation
export function useAssignStudentToClass() {
    const queryCache = useQueryCache()

    return useMutation({
        mutation: ({ studentId, classId }: { studentId: string; classId: string }) =>
            StudentsAPI.assignToClass(studentId, classId),
        onSettled: () => {
            // Invalidate both students and classes data
            void queryCache.invalidateQueries({ key: [STUDENTS_QUERY_KEY] })
            void queryCache.invalidateQueries({ key: ['classes'] })
        },
    })
}

// Assign multiple students to class mutation
export function useAssignMultipleToClass() {
    const queryCache = useQueryCache()

    return useMutation({
        mutation: async ({ studentIds, classId }: { studentIds: string[]; classId: string }) => {
            // Execute assignments for all students
            const assignPromises = studentIds.map(studentId =>
                StudentsAPI.assignToClass(studentId, classId)
            )

            // Wait for all operations to complete
            await Promise.all(assignPromises)

            return { assigned: studentIds.length, classId }
        },
        onSettled: () => {
            // Invalidate both students and classes data
            void queryCache.invalidateQueries({ key: [STUDENTS_QUERY_KEY] })
            void queryCache.invalidateQueries({ key: ['classes'] })
        },
    })
}

// Remove student from class mutation
export function useRemoveStudentFromClass() {
    const queryCache = useQueryCache()

    return useMutation({
        mutation: ({ studentId, classId }: { studentId: string; classId: string }) =>
            StudentsAPI.removeFromClass(studentId, classId),
        onSettled: () => {
            // Invalidate both students and classes data
            void queryCache.invalidateQueries({ key: [STUDENTS_QUERY_KEY] })
            void queryCache.invalidateQueries({ key: ['classes'] })
        },
    })
}

// Remove multiple students from class mutation
export function useRemoveMultipleFromClass() {
    const queryCache = useQueryCache()

    return useMutation({
        mutation: async ({ studentIds, classId }: { studentIds: string[]; classId: string }) => {
            // Execute removals for all students
            const removePromises = studentIds.map(studentId =>
                StudentsAPI.removeFromClass(studentId, classId)
            )

            // Wait for all operations to complete
            await Promise.all(removePromises)

            return { removed: studentIds.length, classId }
        },
        onSettled: () => {
            // Invalidate both students and classes data
            void queryCache.invalidateQueries({ key: [STUDENTS_QUERY_KEY] })
            void queryCache.invalidateQueries({ key: ['classes'] })
        },
    })
}

// Update student class assignments mutation (bulk operations)
export function useUpdateStudentClasses() {
    const queryCache = useQueryCache()

    return useMutation({
        mutation: async ({ studentId, newClassIds }: { studentId: string; newClassIds: string[] }) => {
            // First, get current student data to compare class assignments
            const currentStudent = await StudentsAPI.getById(studentId)
            if (!currentStudent) {
                throw new Error('Student not found')
            }

            const currentClassIds = currentStudent.classIds
            const toAdd = newClassIds.filter(classId => !currentClassIds.includes(classId))
            const toRemove = currentClassIds.filter(classId => !newClassIds.includes(classId))

            // Execute additions
            const addPromises = toAdd.map(classId =>
                StudentsAPI.assignToClass(studentId, classId)
            )

            // Execute removals
            const removePromises = toRemove.map(classId =>
                StudentsAPI.removeFromClass(studentId, classId)
            )

            // Wait for all operations to complete
            await Promise.all([...addPromises, ...removePromises])

            return { added: toAdd.length, removed: toRemove.length }
        },
        onSettled: () => {
            // Invalidate both students and classes data
            void queryCache.invalidateQueries({ key: [STUDENTS_QUERY_KEY] })
            void queryCache.invalidateQueries({ key: ['classes'] })
        },
    })
}
