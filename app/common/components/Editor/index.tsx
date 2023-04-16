import RichMarkdownEditor from "rich-markdown-editor";
import { toast } from "react-toastify";
import dark, { light } from "./styles/theme";
import { storeImage } from "../../utils/ipfs";
import React, { memo, useEffect, useRef, useState } from "react";
import { Box, ThemeProvider, useTheme } from "degen";
import {
  BlockOutlined,
  TwitterOutlined,
  YoutubeFilled,
} from "@ant-design/icons";
import LoomIcon from "@/app/assets/icons/loom_beam_color.svg";
import FigmaIcon from "@/app/assets/icons/figma_icon.svg";
import GeneralEmbed from "../Embeds/GeneralEmbed";
import FigmaEmbed from "../Embeds/FigmaEmbed";
import MiroEmbed from "../Embeds/MiroEmbed";
import { FaFigma } from "react-icons/fa";
import { SiLoom, SiMiro } from "react-icons/si";
import { ImEmbed } from "react-icons/im";

type Props = {
  value?: string;
  onChange?: (val: string) => void;
  onSave?: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  tourId?: string;
  setIsDirty?: (val: boolean) => void;
  isDirty?: boolean;
};

function Editor({
  value,
  placeholder,
  disabled,
  tourId,
  onSave,
  onChange,
  isDirty,
  setIsDirty,
}: Props) {
  const [content, setcontent] = useState(value);
  const { mode } = useTheme();
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.removedNodes.forEach((node) => {
              if (node.nodeName === "BLOCKQUOTE") {
                const script = document.getElementById("twitter-wjs");
                if (script) {
                  script.remove();
                }
              }
            });
          }
        });
      });

      observer.observe(editorRef.current, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
      };
    }
  }, [editorRef]);

  const handleYouTubeEmbed = ({
    attrs,
  }: {
    attrs: {
      href: string;
      matches: any;
    };
  }): any => {
    const id =
      attrs?.href &&
      attrs.href.match(
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/
      )?.[2];

    if (id) {
      return (
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${id}?rel=0&enablejsapi=1`}
          allowFullScreen
          title="YouTube Video"
        />
      );
    }
  };

  const LoomEmbed = ({
    attrs,
  }: {
    attrs: {
      href: string;
      matches: any;
    };
  }): any => {
    const videoId = attrs?.href.match(/(?:share\/)([^/]+)/)?.[1];

    if (videoId) {
      return (
        <iframe
          src={`https://www.loom.com/embed/${videoId}`}
          width="640"
          height="360"
          title="Loom Video"
        />
      );
    }
  };

  const TweetEmbed = ({
    attrs,
  }: {
    attrs: {
      href: string;
      matches: any;
    };
  }) => {
    if (!attrs?.href) return null;
    const tweetId = attrs?.href.split("/").pop();
    const tweetRef = useRef(null);

    useEffect(() => {
      if ((window as any).twttr && (window as any).twttr.widgets) {
        (window as any).twttr.widgets
          .createTweet(tweetId, tweetRef.current, {
            conversation: "none",
            dnt: true,
          })
          .catch((error: any) => {
            console.error("Failed to render tweet:", error);
          });
      }

      return () => {
        if (tweetRef.current) {
          (tweetRef.current as any).innerHTML = "";
        }
      };
    }, [tweetId]);

    return (
      <div
        ref={tweetRef}
        className="twitter-tweet"
        data-conversation="none"
        data-dnt="true"
      >
        <a href={attrs?.href}></a>
      </div>
    );
  };

  return (
    <Box onMouseLeave={() => onSave && onSave(content as string)}>
      <RichMarkdownEditor
        data-tour={tourId}
        dark={mode === "dark"}
        theme={mode === "dark" ? dark : light}
        disableExtensions={["emoji", "table"]}
        defaultValue={value}
        onChange={(val) => {
          setIsDirty && setIsDirty(true);
          setcontent(val());
          onChange && onChange(val());
        }}
        placeholder={placeholder}
        uploadImage={async (file) => {
          console.log({ file });
          const { imageGatewayURL } = await toast.promise(storeImage(file), {
            pending: "Upload is pending",
            success: {
              render: "Image Uploaded",
            },
            error: "Some error occured🤯",
          });
          console.log({ imageGatewayURL });
          return imageGatewayURL;
        }}
        readOnly={disabled || false}
        onBlur={() => {
          if (isDirty) {
            onSave && onSave(content as string);
          }
        }}
        embeds={[
          {
            title: "Embed",
            keywords: "embed",
            icon: () => (
              <Box
                style={{
                  margin: "0.33rem",
                }}
              >
                <ImEmbed />
              </Box>
            ),
            matcher: (url) => {
              return true; // Match all URLs
            },
            component: ({ attrs }) => GeneralEmbed({ attrs, mode }),
          },
          {
            title: "YouTube",
            keywords: "youtube video",
            icon: () => (
              <Box
                style={{
                  margin: "0.33rem",
                }}
              >
                <YoutubeFilled />
              </Box>
            ),
            defaultHidden: false,
            matcher: (url) =>
              url.match(
                /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/)?([^#&?]{11})/
              ) as RegExpMatchArray,
            component: handleYouTubeEmbed,
          },
          {
            title: "Tweet",
            keywords: "twitter tweet",
            icon: () => (
              <Box
                style={{
                  margin: "0.33rem",
                }}
              >
                <TwitterOutlined />
              </Box>
            ),
            defaultHidden: false,
            matcher: (url) => {
              return url.match(
                /^https?:\/\/(www\.)?(twitter\.com)\/.+/
              ) as RegExpMatchArray;
            },
            component: TweetEmbed,
          },
          {
            title: "Loom",
            keywords: "loom video",
            icon: () => (
              <Box
                style={{
                  margin: "0.33rem",
                }}
              >
                <SiLoom />
              </Box>
            ),
            defaultHidden: false,
            matcher: (url) =>
              url.match(
                /^https?:\/\/(?:www\.)?loom\.com\/share\/[a-zA-Z0-9]+/
              ) as RegExpMatchArray,
            component: LoomEmbed,
          },
          {
            title: "Figma",
            keywords: "figma",
            icon: () => (
              <Box
                style={{
                  margin: "0.33rem",
                }}
              >
                <FaFigma />
              </Box>
            ),
            matcher: (url) => {
              // Match Figma URLs
              return /^https:\/\/www\.figma\.com\/(file|proto)\/[0-9a-zA-Z]{22,}/.test(
                url
              );
            },
            component: FigmaEmbed,
          },
          {
            title: "Miro",
            keywords: "miro",
            icon: () => (
              <Box
                style={{
                  margin: "0.33rem",
                }}
              >
                <SiMiro />
              </Box>
            ),
            matcher: (url) => {
              // Match Miro URLs
              console.log({ url });

              return /^https:\/\/miro\.com\/app\/board\/[0-9a-zA-Z]{22,}/.test(
                url
              );
            },
            component: MiroEmbed,
          },
        ]}
      />
    </Box>
  );
}

export default memo(Editor);
export type { Props as EditorProps };
