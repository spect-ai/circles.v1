module.exports = {
  siteUrl: "https://yourdomain.com",
  generateRobotsTxt: true,
  exclude: ["/en*", "/de*", "/disallowed"],
  alternateRefs: [
    {
      href: "https://yourdomain.com/en",
      hreflang: "en",
    },
    {
      href: "https://yourdomain.com/de",
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
