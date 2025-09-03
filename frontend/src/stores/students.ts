import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { CreateStudentRequest, UpdateStudentRequest } from '../components/models'
import {
    useStudents,
    useCreateStudent,
    useUpdateStudent,
    useDeleteStudent,
    useAssignStudentToClass,
    useAssignMultipleToClass,
    useRemoveStudentFromClass,
    useRemoveMultipleFromClass,
    useUpdateStudentClasses
} from '../composables/useStudents'

export const useStudentsStore = defineStore('students', () => {
    // Use Pinia Colada queries
    const studentsQuery = useStudents()
    const createStudentMutation = useCreateStudent()
    const updateStudentMutation = useUpdateStudent()
    const deleteStudentMutation = useDeleteStudent()
    const assignToClassMutation = useAssignStudentToClass()
    const assignMultipleToClassMutation = useAssignMultipleToClass()
    const removeFromClassMutation = useRemoveStudentFromClass()
    const removeMultipleFromClassMutation = useRemoveMultipleFromClass()
    const updateStudentClassesMutation = useUpdateStudentClasses()

    // Computed properties for easy access
    const students = computed(() => studentsQuery.data.value || [])
    const isLoading = computed(() => studentsQuery.isLoading.value)
    const error = computed(() => studentsQuery.error.value)

    // Getters
    const getStudentById = computed(() => {
        return (id: string) => students.value.find(student => student.id === id)
    })

    const getStudentsByClassId = computed(() => {
        return (classId: string) => students.value.filter(student =>
            student.classIds.includes(classId)
        )
    })

    const studentsCount = computed(() => students.value.length)

    // Actions that wrap the mutations
    const addStudent = async (student: CreateStudentRequest) => {
        try {
            const result = await createStudentMutation.mutateAsync(student)
            return result
        } catch (error) {
            console.error('Failed to add student:', error)
            throw error
        }
    }

    const editStudent = async (id: string, updates: UpdateStudentRequest) => {
        try {
            const result = await updateStudentMutation.mutateAsync({ id, request: updates })
            return result
        } catch (error) {
            console.error('Failed to edit student:', error)
            throw error
        }
    }

    const removeStudent = async (id: string) => {
        try {
            await deleteStudentMutation.mutateAsync(id)
        } catch (error) {
            console.error('Failed to remove student:', error)
            throw error
        }
    }

    const assignToClass = async (studentId: string, classId: string) => {
        try {
            await assignToClassMutation.mutateAsync({ studentId, classId })
        } catch (error) {
            console.error('Failed to assign student to class:', error)
            throw error
        }
    }

    const assignMultipleToClass = async (studentIds: string[], classId: string) => {
        try {
            const result = await assignMultipleToClassMutation.mutateAsync({ studentIds, classId })
            return result
        } catch (error) {
            console.error('Failed to assign multiple students to class:', error)
            throw error
        }
    }

    const removeFromClass = async (studentId: string, classId: string) => {
        try {
            await removeFromClassMutation.mutateAsync({ studentId, classId })
        } catch (error) {
            console.error('Failed to remove student from class:', error)
            throw error
        }
    }

    const removeMultipleFromClass = async (studentIds: string[], classId: string) => {
        try {
            const result = await removeMultipleFromClassMutation.mutateAsync({ studentIds, classId })
            return result
        } catch (error) {
            console.error('Failed to remove multiple students from class:', error)
            throw error
        }
    }

    const updateStudentClasses = async (studentId: string, newClassIds: string[]) => {
        try {
            const result = await updateStudentClassesMutation.mutateAsync({ studentId, newClassIds })
            return result
        } catch (error) {
            console.error('Failed to update student classes:', error)
            throw error
        }
    }

    // Refresh data
    const refresh = () => {
        void studentsQuery.refetch()
    }

    return {
        // Data
        students,
        isLoading,
        error,

        // Getters
        getStudentById,
        getStudentsByClassId,
        studentsCount,

        // Actions
        addStudent,
        editStudent,
        removeStudent,
        assignToClass,
        assignMultipleToClass,
        removeFromClass,
        removeMultipleFromClass,
        updateStudentClasses,
        refresh,

        // Mutation states for UI feedback
        isCreating: computed(() => createStudentMutation.isLoading.value),
        isUpdating: computed(() => updateStudentMutation.isLoading.value),
        isDeleting: computed(() => deleteStudentMutation.isLoading.value),
        isAssigning: computed(() => assignToClassMutation.isLoading.value),
        isAssigningMultiple: computed(() => assignMultipleToClassMutation.isLoading.value),
        isUnassigning: computed(() => removeFromClassMutation.isLoading.value),
        isRemovingMultiple: computed(() => removeMultipleFromClassMutation.isLoading.value),
        isUpdatingClasses: computed(() => updateStudentClassesMutation.isLoading.value),
    }
})
