/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ALCHEMY_KEY: process.env.ALCHEMY_KEY,
    DEV_ENV: process.env.DEV_ENV,
    WEB3_STORAGE_TOKEN: process.env.WEB3_STORAGE_TOKEN,
  },
};

module.exports = nextConfig;
