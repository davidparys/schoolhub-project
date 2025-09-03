import { ClassesService } from '../../../services/classes'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const classId = query.classId as string

        if (!classId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Class ID is required',
            })
        }

        const students = await ClassesService.getStudents(classId)
        return { data: students }
    } catch (error) {
        console.error('Error fetching class students:', error)

        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error',
        })
    }
})
