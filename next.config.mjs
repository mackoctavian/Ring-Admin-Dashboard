/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable type checking (if using TypeScript)
    typescript: {
      ignoreBuildErrors: true,
    },
    // Disable ESLint during build
    eslint: {
      ignoreDuringBuilds: true,
    },
    // Custom webpack configuration
    webpack: (config, { dev }) => {
      if (dev) {
        // Development-specific configuration
      }
      return config;
    },
  };
  
  export default nextConfig;  
  