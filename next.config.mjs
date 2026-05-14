import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Alias "canvas" to false for pdfjs-dist in browser.
      canvas: false,
    };

    // Add rule for .wasm files (for @imgly/background-removal)
    config.experiments = { ...config.experiments, asyncWebAssembly: true, layers: true };

    // Next.js handles WebAssembly natively with `asyncWebAssembly` flag in Webpack 5.
    return config;
  },
  async headers() {
    return [
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
  },
};

export default nextConfig;