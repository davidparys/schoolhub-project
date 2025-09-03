import { defineEventHandler, setResponseHeaders, getMethod, setResponseStatus } from 'h3'

export default defineEventHandler((event) => {
    // Set CORS headers for all requests
    setResponseHeaders(event, {
        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'https://schoolhub-project.vercel.app',
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