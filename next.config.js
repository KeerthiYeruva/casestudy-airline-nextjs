const nextConfig = {
  reactStrictMode: true,
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
