import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { CreateClassRequest, UpdateClassRequest } from '../components/models'
import {
    useClasses,
    useCreateClass,
    useUpdateClass,
    useDeleteClass,
    useClassStudents
} from '../composables/useClasses'

export const useClassesStore = defineStore('classes', () => {
    // Use Pinia Colada queries
    const classesQuery = useClasses()
    const createClassMutation = useCreateClass()
    const updateClassMutation = useUpdateClass()
    const deleteClassMutation = useDeleteClass()

    // Computed properties for easy access
    const classes = computed(() => classesQuery.data.value || [])
    const isLoading = computed(() => classesQuery.isLoading.value)
    const error = computed(() => classesQuery.error.value)

    // Getters
    const getClassById = computed(() => {
        return (id: string) => classes.value.find(cls => cls.id === id)
    })

    const classesCount = computed(() => classes.value.length)

    const sortedClasses = computed(() => {
        return [...classes.value].sort((a, b) => a.name.localeCompare(b.name))
    })

    // Actions that wrap the mutations
    const addClass = async (classData: CreateClassRequest) => {
        try {
            const result = await createClassMutation.mutateAsync(classData)
            return result
        } catch (error) {
            console.error('Failed to add class:', error)
            throw error
        }
    }

    const editClass = async (id: string, updates: UpdateClassRequest) => {
        try {
            const result = await updateClassMutation.mutateAsync({ id, request: updates })
            return result
        } catch (error) {
            console.error('Failed to edit class:', error)
            throw error
        }
    }

    const removeClass = async (id: string) => {
        try {
            await deleteClassMutation.mutateAsync(id)
        } catch (error) {
            console.error('Failed to remove class:', error)
            throw error
        }
    }

    // Helper function to get students for a specific class
    const getClassStudents = (classId: string) => {
        return useClassStudents(classId)
    }

    // Refresh data
    const refresh = () => {
        void classesQuery.refetch()
    }

    return {
        // Data
        classes,
        isLoading,
        error,

        // Getters
        getClassById,
        classesCount,
        sortedClasses,

        // Actions
        addClass,
        editClass,
        removeClass,
        getClassStudents,
        refresh,

        // Mutation states for UI feedback
        isCreating: computed(() => createClassMutation.isLoading.value),
        isUpdating: computed(() => updateClassMutation.isLoading.value),
        isDeleting: computed(() => deleteClassMutation.isLoading.value),
    }
})
