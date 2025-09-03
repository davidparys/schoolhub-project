import { ClassesService } from '../../../services/classes'

export default defineEventHandler(async (event) => {
    try {
        const classesData = await ClassesService.getAll()
        return { data: classesData }
    } catch (error) {
        console.error('Error fetching classes:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error',
        })
    }
})
