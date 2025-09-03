import { ClassesService } from '../../../services/classes'
import { CreateClassSchema } from '../../../types/api'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        // Validate request body
        const parseResult = CreateClassSchema.safeParse(body)
        if (!parseResult.success) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Invalid request data',
                data: parseResult.error.errors,
            })
        }

        const classData = await ClassesService.create(parseResult.data)

        setResponseStatus(event, 201)
        return { data: classData }
    } catch (error) {
        console.error('Error creating class:', error)

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
