import { StudentsService } from '../../../services/students'

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')

        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Student ID is required',
            })
        }

        const student = await StudentsService.getById(id)

        if (!student) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: 'Student not found',
            })
        }

        return { data: student }
    } catch (error) {
        console.error('Error fetching student:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error',
        })
    }
})
