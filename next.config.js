/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  transpilePackages: [],
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
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Vercel optimizations for Next.js 15
  serverExternalPackages: ['mongodb'],
  // Add webpack configuration for MongoDB and Genkit
  webpack: (config, { isServer }) => {
    // Handle Node.js modules for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        'mongodb-client-encryption': false,
        aws4: false,
        'snappy/package.json': false,
        snappy: false,
        bson: false,
      };
    }

    // Handle specific modules that might cause issues
    config.resolve.alias = {
      ...config.resolve.alias,
      // Polyfills for Node.js modules that might be needed
      dns: false,
      fs: false,
      path: false,
      net: false,
      tls: false,
      // Disable OpenTelemetry
      '@opentelemetry/exporter-jaeger': false,
      '@opentelemetry/sdk-node': false,
    };

    // Ignore warnings for certain packages
    config.ignoreWarnings = [
      { module: /node_modules\/handlebars/ },
      { module: /node_modules\/express/ },
      { module: /node_modules\/@genkit-ai/ },
      { module: /node_modules\/@opentelemetry/ },
    ];

    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };

    return config;
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Reduce bundle size
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
