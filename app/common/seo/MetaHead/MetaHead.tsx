import { NextSeo } from "next-seo";
import { useLocation } from "react-use";

type props = {
  title: string;
  description: string;
  image: string;
};
export default function MetaHead({
  title,
  description,
  image,
}: props): JSX.Element {
  const siteURL = "https://circles.spect.network";
  const pathName = useLocation().pathname;
  const pageURL = pathName === "/" ? siteURL : siteURL + pathName;
  const twitterHandle = "@JoinSpect";
  const siteName = "Spect";

  return (
    <NextSeo
      title={title}
      description={description}
      canonical={pageURL}
      openGraph={{
        type: "website",
        locale: "en_US", //  Default is en_US
        url: pageURL,
        title,
        description: description,
        images: [
          {
            url: image,
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
          href: `/favicon.ico`,
        },
        // {
        //   rel: "manifest",
        //   href: "/site.manifest",
        // },
      ]}
    />
  );
}
