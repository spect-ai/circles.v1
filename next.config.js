/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["s3.amazonaws.com"],
  },
  env: {
    ALCHEMY_KEY: process.env.ALCHEMY_KEY,
    DEV_ENV: process.env.DEV_ENV,
    WEB3_STORAGE_TOKEN: process.env.WEB3_STORAGE_TOKEN,
    API_HOST: process.env.API_HOST,
    BOT_HOST: process.env.BOT_HOST,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

module.exports = nextConfig;
