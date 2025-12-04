const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Temporarily ignore build errors during TypeScript migration
    ignoreBuildErrors: true,
  },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
};

module.exports = nextConfig;
