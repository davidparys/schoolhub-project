import { StudentsService } from '../../../services/students'
import { CreateStudentSchema } from '../../../types/api'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        // Validate request body
        const parseResult = CreateStudentSchema.safeParse(body)
        if (!parseResult.success) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Invalid request data',
                data: parseResult.error.errors,
            })
        }

        const student = await StudentsService.create(parseResult.data)

        setResponseStatus(event, 201)
        return { data: student }
    } catch (error) {
        console.error('Error creating student:', error)

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
