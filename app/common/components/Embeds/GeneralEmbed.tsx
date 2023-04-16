import { Box, Text, useTheme } from "degen";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const GeneralEmbed = ({
  attrs,
  mode,
}: {
  attrs: {
    href: string;
  };
  mode: string;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isEmbeddable, setIsEmbeddable] = useState(false);

  const isIframe = /<iframe.*src="(.*)".*<\/iframe>/i;

  const getIframeSrc = (embedCode: string) => {
    const match = embedCode.match(isIframe);
    return match ? match[1] : null;
  };

  const src = getIframeSrc(attrs?.href);

  if (src)
    return (
      <div
        style={{ width: "100%", paddingBottom: "56.25%", position: "relative" }}
      >
        <iframe
          src={attrs?.href}
          title="General Embed"
          style={{
            border: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          allowFullScreen
        />
      </div>
    );
  else {
    void (async () => {
      try {
        if (attrs?.href) {
          console.log({ href: attrs?.href });
          const res = await (
            await fetch(`${process.env.API_HOST}/common/url`, {
              credentials: "include",
              body: JSON.stringify({
                url: attrs?.href,
              }),
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            })
          ).json();
          console.log({ res });
          setIsEmbeddable(res?.allowsEmbed);
          if (res?.title) {
            setTitle(res?.title);
          }
          if (res?.description) {
            setDescription(res?.description);
          }
          if (res?.imageUrl) {
            setImageUrl(res?.imageURL);
          }
        }
      } catch (e) {
        console.log({ e });
      }
    })();
    if (isEmbeddable) {
      return (
        <div
          style={{
            width: "100%",
            paddingBottom: "56.25%",
            position: "relative",
          }}
        >
          <iframe
            src={attrs?.href}
            title="General Embed"
            style={{
              border: 0,
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            allowFullScreen
          />
        </div>
      );
    }
    return (
      <Box>
        {title && description ? (
          <EmbedCard mode={mode}>
            <Box display="flex" flexDirection="row" width="full">
              <Box width="3/4">
                <Text variant="large" weight="bold">
                  {title?.length > 50 ? title.substring(0, 50) + "..." : title}
                </Text>
                <Text variant="base">
                  {description?.length > 150
                    ? description.substring(0, 150) + "..."
                    : description}
                </Text>
              </Box>
              <Box width="1/4">
                <StyledImage src={imageUrl} />
              </Box>
            </Box>
          </EmbedCard>
        ) : (
          <Box>
            <Link href={attrs?.href}>{attrs?.href}</Link>
          </Box>
        )}
      </Box>
    );
  }
};

export default GeneralEmbed;

const EmbedCard = styled(Box)<{
  mode: string;
  width?: string;
  height?: string;
}>`
  @media (max-width: 1420px) {
    width: 100%;
    padding: 0.5rem;
    margin: 0;
    height: auto;
    margin-top: 0.5rem;
    align-items: flex-start;
  }
  height: ${(props) => props.height || "auto"};
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  align-items: flex-start;
  position: relative;
  transition: all 0.5s ease-in-out;
  border: 1px solid;
  border-color: ${(props) => (props.mode === "dark" ? "#232323" : "#E5E5E5")};
`;

const StyledImage = styled.img`
  @media (max-width: 768px) {
    width: 16rem;
  }
  width: 100%;
`;
