/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webpack config for WASM and canvas aliases
  webpack: (config, { isServer }) => {
    // Handle wasm files for @imgly/background-removal
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      syncWebAssembly: true,
    };

    // Add rule for .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });

    // Canvas fallback for pdfjs-dist
    if (!isServer) {
      config.resolve.alias.canvas = false;
    }

    return config;
  },

  // Headers for SharedArrayBuffer (required by background-removal WASM)
  // Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy
  // are needed for cross-origin isolation
  // We'll add these via middleware or next.config headers
  // Since Next.js 15 uses a different format, we'll handle via middleware
};

// For Next.js 15, we need to use headers configuration
// But headers in next.config might not support COOP/COEP directly in dev
// We'll add them conditionally for production builds
if (process.env.NODE_ENV === 'production') {
  nextConfig.headers = async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin',
        },
        {
          key: 'Cross-Origin-Embedder-Policy',
          value: 'require-corp',
        },
      ],
    },
  ];
}

module.exports = nextConfig;
