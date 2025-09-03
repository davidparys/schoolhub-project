import { StudentsService } from '../../../services/students'

export default defineEventHandler(async (event) => {
    try {
        const studentsData = await StudentsService.getAll()
        return { data: studentsData }
    } catch (error) {
        console.error('Error fetching students:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error',
        })
    }
})
