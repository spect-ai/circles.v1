import {
  Box,
  Button,
  IconArrowUpRight,
  IconClose,
  Text,
  useTheme,
} from "degen";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ResizableIframe from "../ResizableIframe";

const GeneralEmbed = ({
  attrs,
  mode,
  findEmbedNode,
  resizeEmbed,
  resizeable,
}: {
  attrs: {
    href: string;
  };
  mode: string;
  findEmbedNode: (url: string) => void;
  resizeEmbed: (url: string, width: any, height: any) => void;
  resizeable: boolean;
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
      <div style={{ width: "100%", position: "relative" }}>
        <ResizableIframe
          src={attrs?.href}
          title="General Embed"
          onResize={(height: number, width: number) => {
            resizeEmbed(attrs?.href, width, height);
          }}
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

            position: "relative",
          }}
        >
          {" "}
          <ResizableIframe
            src={attrs?.href}
            title="General Embed"
            onResize={(height: number, width: number) => {
              resizeEmbed(attrs?.href, width, height);
            }}
          />
          <Button
            shape="circle"
            size="small"
            variant="transparent"
            onClick={() => findEmbedNode(attrs?.href)}
          >
            <IconClose />
          </Button>
        </div>
      );
    }
    return (
      <Box>
        {title && description ? (
          <EmbedCard mode={mode}>
            <Box
              display="flex"
              flexDirection="row"
              width="full"
              justifyContent="flex-end"
              padding="0"
              margin="0"
            >
              <Button
                shape="circle"
                size="extraSmall"
                variant="transparent"
                onClick={() => findEmbedNode(attrs?.href)}
              >
                <IconClose />
              </Button>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              width="full"
              alignItems="flex-start"
              marginTop="2"
              gap="2"
              onClick={() => {
                window.open(attrs?.href, "_blank");
              }}
            >
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
                <StyledImage
                  src={
                    imageUrl ||
                    `https://api.dicebear.com/6.x/identicon/svg?seed=${attrs?.href}`
                  }
                />
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
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "fit-content"};
  border-radius: 0.5rem;
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
  width: 80%;
  height: 80%;
`;
