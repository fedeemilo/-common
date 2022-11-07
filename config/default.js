module.exports = {
    logger: {
        transports: {
            console: {
                level: "info",
                preset: "prod"
            },
            http: {
                host: "localhost",
                port: 1000,
                level: "critical"
            }
        }
    },
    passThroughHeaders: ["x-request-id", "cf-request-id"],
    port: 3000,
    coverage: false,
    cors: {
        origin: "*"
    },
    cache: {
        httpServer: {
            enabled: false, // true | false
            global: false, // true for global app cache (every endpoint) | false, to include in each endpoint
            options: {
                type: "memory", // memory | redis
                defaultDuration: "5 minutes", // should be either a number (in ms) or a string, defaults to 1 hour
                trackPerformance: false,
                debug: false,
                statusCodes: {
                    exclude: [409, 404, 403, 500], // list status codes to specifically exclude (e.g. [404, 403] cache all responses unless they had a 404 or 403 status)
                    include: [200] // list status codes to require (e.g. [200] caches ONLY responses with a success/200 code)
                },
                redis: {
                    url: "redis://127.0.0.1:6379"
                    // "env_url": "REDISS_ACCESS_URL", legacy alternative in environment variable and encrypted
                    // should de present in 'custom-environment-variables.json' in 'config' module - if present.
                    // example "rediss_url": "REDISS_ACCESS_URL" could be "url": "REDISS_ACCESS_URL"
                }
            }
        }
    }
};
