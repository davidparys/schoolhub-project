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

        await StudentsService.delete(id)

        setResponseStatus(event, 204)
        return null
    } catch (error) {
        console.error('Error deleting student:', error)

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
