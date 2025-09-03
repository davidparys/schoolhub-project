import { StudentsService } from '../../../services/students'
import { UpdateStudentSchema } from '../../../types/api'

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

        const body = await readBody(event)

        // Validate request body
        const parseResult = UpdateStudentSchema.safeParse(body)
        if (!parseResult.success) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Invalid request data',
                data: parseResult.error.errors,
            })
        }

        const student = await StudentsService.update(id, parseResult.data)
        return { data: student }
    } catch (error) {
        console.error('Error updating student:', error)

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
