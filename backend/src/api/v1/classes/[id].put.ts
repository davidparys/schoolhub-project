import { ClassesService } from '../../../services/classes'
import { UpdateClassSchema } from '../../../types/api'

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

        const body = await readBody(event)

        // Validate request body
        const parseResult = UpdateClassSchema.safeParse(body)
        if (!parseResult.success) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Invalid request data',
                data: parseResult.error.errors,
            })
        }

        const classData = await ClassesService.update(id, parseResult.data)
        return { data: classData }
    } catch (error) {
        console.error('Error updating class:', error)

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
