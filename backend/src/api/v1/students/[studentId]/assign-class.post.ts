import { StudentsService } from '../../../../services/students'

export default defineEventHandler(async (event) => {
    try {
        const studentId = getRouterParam(event, 'studentId')

        if (!studentId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Student ID is required',
            })
        }

        const body = await readBody(event)

        if (!body.classId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'classId is required',
            })
        }

        await StudentsService.assignToClass(studentId, body.classId)

        setResponseStatus(event, 204)
        return null
    } catch (error) {
        console.error('Error assigning student to class:', error)

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
