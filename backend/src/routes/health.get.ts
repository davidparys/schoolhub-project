export default defineEventHandler(async (event) => {
    return {
        message: 'School Hub API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        status: 'healthy'
    }
})
