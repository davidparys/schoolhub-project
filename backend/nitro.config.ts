import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
    compatibilityDate: "2025-07-15",
    srcDir: "src",
    preset: "vercel",
    vercel: {
        config: {
            bypassToken: process.env.VERCEL_BYPASS_TOKEN
        }
    },
    routeRules: {
        // Disable CORS for all routes
        '/**': {
            cors: false
        }
    },
    experimental: {
        wasm: false
    },
    runtimeConfig: {
        supabaseUrl: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'your-anon-key',
        corsOrigin: process.env.CORS_ORIGIN || 'https://schoolhub-project.vercel.app',
        public: {}
    }
})
