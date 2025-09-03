export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('request', (event) => {
        // Set CORS headers for all requests
        event.node.res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'https://schoolhub-project.vercel.app')
        event.node.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-vercel-protection-bypass')
        event.node.res.setHeader('Access-Control-Allow-Credentials', 'false')

        // Handle preflight OPTIONS request
        if (event.node.req.method === 'OPTIONS') {
            event.node.res.statusCode = 200
            event.node.res.end()
            return
        }
    })
})
