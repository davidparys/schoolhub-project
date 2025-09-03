import { ClassesService } from '../../../services/classes'

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')

        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Class ID is required',
            })
        }

        const classData = await ClassesService.getById(id)

        if (!classData) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: 'Class not found',
            })
        }

        return { data: classData }
    } catch (error) {
        console.error('Error fetching class:', error)

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
