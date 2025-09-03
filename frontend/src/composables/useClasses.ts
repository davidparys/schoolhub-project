import { useQuery, useMutation, useQueryCache } from '@pinia/colada'
import { ClassesAPI } from '../services/api'
import type { CreateClassRequest, UpdateClassRequest } from '../components/models'

// Query keys for consistent cache management
export const CLASSES_QUERY_KEY = 'classes'
export const CLASS_QUERY_KEY = (id: string) => ['class', id]
export const CLASS_STUDENTS_QUERY_KEY = (id: string) => ['class-students', id]

// Fetch all classes
export function useClasses() {
    return useQuery({
        key: [CLASSES_QUERY_KEY],
        query: () => ClassesAPI.getAll(),
    })
}

// Fetch single class
export function useClass(id: string) {
    return useQuery({
        key: CLASS_QUERY_KEY(id),
        query: () => ClassesAPI.getById(id),
        enabled: !!id,
    })
}

// Fetch students in a specific class
export function useClassStudents(classId: string) {
    return useQuery({
        key: CLASS_STUDENTS_QUERY_KEY(classId),
        query: () => ClassesAPI.getStudents(classId),
        enabled: !!classId,
    })
}

// Create class mutation
export function useCreateClass() {
    const queryCache = useQueryCache()

    return useMutation({
        mutation: (request: CreateClassRequest) => ClassesAPI.create(request),
        onSettled: () => {
            // Invalidate and refetch classes list
            void queryCache.invalidateQueries({ key: [CLASSES_QUERY_KEY] })
        },
    })
}

// Update class mutation
export function useUpdateClass() {
    const queryCache = useQueryCache()

    return useMutation({
        mutation: ({ id, request }: { id: string; request: UpdateClassRequest }) =>
            ClassesAPI.update(id, request),
        onSettled: (updatedClass) => {
            // Invalidate classes list to reflect changes
            void queryCache.invalidateQueries({ key: [CLASSES_QUERY_KEY] })
            if (updatedClass) {
                // Invalidate the specific class as well
                void queryCache.invalidateQueries({ key: CLASS_QUERY_KEY(updatedClass.id) })
            }
        },
    })
}

// Delete class mutation
export function useDeleteClass() {
    const queryCache = useQueryCache()

    return useMutation({
        mutation: (id: string) => ClassesAPI.delete(id),
        onSettled: (_, __, deletedId) => {
            // Invalidate classes list and related queries
            void queryCache.invalidateQueries({ key: [CLASSES_QUERY_KEY] })
            void queryCache.invalidateQueries({ key: CLASS_QUERY_KEY(deletedId) })
            void queryCache.invalidateQueries({ key: CLASS_STUDENTS_QUERY_KEY(deletedId) })
        },
    })
}
