export default {
    origin: process.env.ORIGIN,
    env: process.env.ENV,
    logging: process.env.LOGGING,
    server: {
        host: process.env.SERVER_HOST,
        port: process.env.SERVER_PORT,
        secret: process.env.SESSION_SECRET
    },
    cdn: {
        static: process.env.CDN_STATIC,
        img: process.env.CDN_IMG
    },
    api: {
        backend: process.env.API_BACKEND
    },
    cloudflare: {
        api_key: process.env.CLOUDFLARE_API_KEY,
        email: process.env.CLOUDFLARE_EMAIL,
        zone: process.env.CLOUDFLARE_ZONE
    },
    google_maps: {
        api_key: process.env.GOOGLE_MAPS_API_KEY
    }
};
