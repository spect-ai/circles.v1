/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "s3.amazonaws.com",
      "images.mintkudos.xyz",
      "spect.infura-ipfs.io",
    ],
  },
  env: {
    ALCHEMY_KEY: process.env.ALCHEMY_KEY,
    DEV_ENV: process.env.DEV_ENV,
    WEB3_STORAGE_TOKEN: process.env.WEB3_STORAGE_TOKEN,
    API_HOST: process.env.API_HOST,
    BOT_HOST: process.env.BOT_HOST,
    MINTKUDOS_HOST: process.env.MINTKUDOS_HOST,
    BICONOMY_API_KEY: process.env.BICONOMY_API_KEY,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      bufferutil: require.resolve("bufferutil"),
      net: require.resolve("net"),
      request: require.resolve("request"),
      tls: require.resolve("tls"),
      "utf-8-validate": require.resolve("utf-8-validate"),
    };

    return config;
  },
};

module.exports = nextConfig;
