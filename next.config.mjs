/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Alias "canvas" to false for pdfjs-dist in browser
    config.resolve.alias.canvas = false;
    
    // Add rule for .wasm files (for @imgly/background-removal)
    config.experiments = { ...config.experiments, asyncWebAssembly: true, layers: true };

    // Next.js handles WebAssembly natively with `asyncWebAssembly` flag in Webpack 5.
    // If needed, specific file-loader rules for .wasm could be added here.
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
