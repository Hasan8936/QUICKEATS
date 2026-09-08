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

    // Redirects
    redirects: async() => {
        return [{
            source: '/dashboard',
            destination: '/analytics',
            permanent: false,
        }, ];
    },

    // Security headers
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
};

module.exports = nextConfig;