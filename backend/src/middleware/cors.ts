import { defineEventHandler, setResponseHeaders, getMethod, setResponseStatus } from 'h3'

export default defineEventHandler((event) => {
    // Set CORS headers for all requests
    setResponseHeaders(event, {
        // Dynamically set Access-Control-Allow-Origin based on the request's Origin header.
        // Allow process.env.CORS_ORIGIN, the Vercel link, and the production Railway link.
        // If the request's Origin matches one of the allowed origins, set it; otherwise, set to 'null'.
        ...(() => {
            const allowedOrigins = [
                process.env.CORS_ORIGIN,
                'https://schoolhub-project.vercel.app',
                'https://schoolhub-project-production.up.railway.app'
            ].filter(Boolean)
            const requestOrigin = event.node.req.headers.origin
            if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
                return { 'Access-Control-Allow-Origin': requestOrigin }
            } else {
                // If not matched, you can set to 'null' or omit the header
                return { 'Access-Control-Allow-Origin': 'null' }
            }
        })(),
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-vercel-protection-bypass',
        'Access-Control-Allow-Credentials': 'false',
        'Access-Control-Max-Age': '86400' // 24 hours
    })

    // Handle preflight OPTIONS request
    if (event.method === 'OPTIONS') {
        setResponseStatus(event, 200)
        return null
    }
})