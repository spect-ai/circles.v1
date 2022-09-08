module.exports = {
  siteUrl: "https://circles.spect.network",
  generateRobotsTxt: true,
  exclude: ["/en*", "/de*", "/disallowed"],
  alternateRefs: [
    {
      href: "https://circles.spect.network/en",
      hreflang: "en",
    },
    {
      href: "https://circles.spect.network",
      hreflang: "de",
    },
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: "/disallowed",
      },
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
};
