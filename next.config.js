/** @type {import('next').NextConfig} */
const nextConfig = {
    // Image optimization
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'images.unsplash.com',
        }, ],
    },

    // Environment variables
    env: {
        NEXT_PUBLIC_APP_NAME: 'QuickEats',
    },

    // Webpack configuration to handle node modules
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                ioredis: false,
                dns: false,
                net: false,
                tls: false,
                fs: false,
                path: false,
            };
        }
        return config;
    },

    // Headers
    headers: async() => {
        return [{
            source: '/:path*',
            headers: [{
                    key: 'X-Content-Type-Options',
                    value: 'nosniff',
                },
                {
                    key: 'X-Frame-Options',
                    value: 'SAMEORIGIN',
                },
            ],
        }, ];
    },

    // Redirects
    redirects: async() => {
        return [{
            source: '/dashboard',
            destination: '/analytics',
            permanent: false,
        }, ];
    },
};

module.exports = nextConfig;