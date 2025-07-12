/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Add webpack configuration for MongoDB
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Polyfills for Node.js modules that might be needed
      dns: false,
      fs: false,
      path: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;
