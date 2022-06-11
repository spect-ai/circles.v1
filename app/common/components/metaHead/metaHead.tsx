import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

export default function MetaHead(): JSX.Element {
  const title = "Spect Circles";
  const desc =
    "Playground of coordination tools for DAO contributors to manage projects and fund each other";
  const ogImgRelativePath = "/og.jpg";

  const siteURL = "https://circles.spect.network";
  const ogImageURL = `${siteURL}${ogImgRelativePath}`;
  const pathName = useRouter().pathname;
  const pageURL = pathName === "/" ? siteURL : siteURL + pathName;
  const twitterHandle = "@JoinSpect";
  const siteName = "Spect Circles";

  return (
    <NextSeo
      title={title}
      description={desc}
      canonical={pageURL}
      openGraph={{
        type: "website",
        locale: "en_US", //  Default is en_US
        url: pageURL,
        title,
        description: desc,
        images: [
          {
            url: ogImageURL,
            width: 1200,
            height: 630,
            alt: "Spect Circles",
          },
        ],
        site_name: siteName,
      }}
      twitter={{
        handle: twitterHandle,
        site: twitterHandle,
        cardType: "summary_large_image",
      }}
      additionalMetaTags={[
        {
          property: "author",
          content: title,
        },
      ]}
      additionalLinkTags={[
        {
          rel: "icon",
          href: `${siteURL}/favicon.ico`,
        },
        // {
        //   rel: "manifest",
        //   href: "/site.manifest",
        // },
      ]}
    />
  );
}
