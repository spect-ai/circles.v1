/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ALCHEMY_KEY: process.env.ALCHEMY_KEY,
    DEV_ENV: process.env.DEV_ENV,
  },
};

module.exports = nextConfig;
