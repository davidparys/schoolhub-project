import { StudentsService } from '../../../../../services/students'

export default defineEventHandler(async (event) => {
    try {
        const studentId = getRouterParam(event, 'studentId')
        const classId = getRouterParam(event, 'classId')

        if (!studentId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Student ID is required',
            })
        }

        if (!classId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Class ID is required',
            })
        }

        await StudentsService.removeFromClass(studentId, classId)

        setResponseStatus(event, 204)
        return null
    } catch (error) {
        console.error('Error removing student from class:', error)

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
