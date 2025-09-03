import { StudentsService } from '../../../../services/students'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const studentId = query.studentId as string
        const classId = query.classId as string

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

        await StudentsService.assignToClass(studentId, classId)

        setResponseStatus(event, 204)
        return null
    } catch (error) {
        console.error('Error assigning student to class:', error)

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
