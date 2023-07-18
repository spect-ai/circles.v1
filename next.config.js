/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  redirects() {
    return [
      process.env.MAINTENANCE_MODE === "1"
        ? {
            source: "/((?!maintenance).*)",
            destination: "/maintenance.html",
            permanent: false,
          }
        : null,
    ].filter(Boolean);
  },
  reactStrictMode: false,
  images: {
    domains: [
      "s3.amazonaws.com",
      "images.mintkudos.xyz",
      "spect.infura-ipfs.io",
      "assets.poap.xyz",
      "ik.imagekit.io",
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
    MIXPANEL_TOKEN: process.env.MIXPANEL_TOKEN,
  },
  webpack(config, { dev, isServer }) {
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
    if (dev && !isServer) {
      const originalEntry = config.entry;
      config.entry = async () => {
        const wdrPath = path.resolve(__dirname, "./scripts/wdyr.ts");
        const entries = await originalEntry();

        if (entries["main.js"] && !entries["main.js"].includes(wdrPath)) {
          entries["main.js"].push(wdrPath);
        }
        return entries;
      };
    }
    return config;
  },
};

module.exports = nextConfig;
