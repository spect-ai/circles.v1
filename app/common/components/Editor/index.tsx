import { Box, useTheme } from "degen";
import React, { memo, useRef, useState } from "react";
import { FaFigma } from "react-icons/fa";
import { SiLoom, SiMiro } from "react-icons/si";
import { toast } from "react-toastify";
import { storeImage } from "../../utils/ipfs";
import dynamic from "next/dynamic";
import RichMarkdownEditor from "rich-markdown-editor";
import dark, { light } from "./styles/theme";
import LoomEmbed from "../Embeds/LoomEmbed";
import FigmaEmbed from "../Embeds/FigmaEmbed";
import MiroEmbed from "../Embeds/MiroEmbed";
import TweetEmbed, { extractTweetId } from "../Embeds/TwitterEmbed";
import { TwitterOutlined, YoutubeFilled } from "@ant-design/icons";
import YouTubeEmbed from "../Embeds/YoutubeEmbed";
const RichEditor = dynamic(
  () => import("@avp1598/react-beautiful-editor").then((mod) => mod.Editor),
  { ssr: false }
);
type Props = {
  value?: string;
  onChange?: (val: string) => void;
  onSave?: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  setIsDirty?: (val: boolean) => void;
  isDirty?: boolean;
  onFocus?: () => void;
  bounds?: string;
  version: 1 | 2;
};

function Editor({
  value,
  placeholder,
  disabled,
  onSave,
  onChange,
  isDirty,
  setIsDirty,
  onFocus,
  bounds,
  version,
}: Props) {
  const [content, setcontent] = useState(value);
  const { mode } = useTheme();

  const editorRef = useRef<RichMarkdownEditor | null>(null);
  const [dropdownPosition, setDropdownPosition] =
    useState<{ top: number; left: number } | null>(null);
  const [pastedData, setPastedData] = useState<string | null>(null);
  return (
    <Box
      onMouseLeave={() => {
        if (isDirty) {
          onSave && onSave(content as string);
        }
      }}
      color="text"
    >
      {version === 2 ? (
        <RichEditor
          value={value || ""}
          placeholder={placeholder}
          readonly={disabled}
          onChange={(val) => {
            setcontent(val);
            onChange && onChange(val);
            setIsDirty && setIsDirty(true);
          }}
          uploadImage={async (file) => {
            const { imageGatewayURL } = await storeImage(file);
            return imageGatewayURL;
          }}
          theme={mode}
          embedBoundsSelector={bounds}
          onFocus={onFocus}
        />
      ) : (
        <RichMarkdownEditor
          dark={mode === "dark"}
          theme={mode === "dark" ? dark : light}
          disableExtensions={["emoji", "table"]}
          defaultValue={value}
          onChange={(val) => {
            setIsDirty && setIsDirty(true);
            setcontent(val());
            onChange && onChange(val());
          }}
          ref={editorRef}
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
          onFocus={() => {
            if (onFocus) {
              onFocus();
            }
          }}
          embeds={[
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
              matcher: (url) => {
                const id =
                  url &&
                  url.match(
                    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/
                  )?.[2];

                if (!id) return false;

                return true;
              },
              component: YouTubeEmbed,
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
                const match = url.match(
                  /^https?:\/\/(www\.)?(twitter\.com)\/.+/
                ) as RegExpMatchArray;
                if (!match) return false;
                const urlObj = new URL(url);
                urlObj.search = "";
                const urlString = urlObj.toString();
                const tweetId = extractTweetId(urlString);
                if (!tweetId) return false;
                return true;
              },
              component: (e) => {
                return <TweetEmbed attrs={e.attrs} />;
              },
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
              matcher: (url) => {
                const videoId = url.match(/(?:share\/)([^/]+)/)?.[1];
                if (!videoId) return false;
                return true;
              },
              component: LoomEmbed as any,
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
                return /^https:\/\/miro\.com\/app\/board\/[0-9a-zA-Z]/.test(
                  url
                );
              },
              component: MiroEmbed,
            },
          ]}
        />
      )}
    </Box>
  );
}

export default memo(Editor);
export type { Props as EditorProps };
