import { TwitterOutlined, YoutubeFilled } from "@ant-design/icons";
import { Box, useTheme } from "degen";
import React, { Ref, memo, useEffect, useRef, useState } from "react";
import { FaFigma } from "react-icons/fa";
import { ImEmbed } from "react-icons/im";
import { SiLoom, SiMiro } from "react-icons/si";
import { toast } from "react-toastify";
import RichMarkdownEditor, { Props as EditorProps } from "rich-markdown-editor";
import { storeImage } from "../../utils/ipfs";
import FigmaEmbed from "../Embeds/FigmaEmbed";
import GeneralEmbed from "../Embeds/GeneralEmbed";
import LoomEmbed from "../Embeds/LoomEmbed";
import MiroEmbed from "../Embeds/MiroEmbed";
import TweetEmbed from "../Embeds/TwitterEmbed";
import YouTubeEmbed from "../Embeds/YoutubeEmbed";
import dark, { light } from "./styles/theme";
import { EditorState, Transaction } from "prosemirror-state";

type Props = {
  value?: string;
  onChange?: (val: string) => void;
  onSave?: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  tourId?: string;
  setIsDirty?: (val: boolean) => void;
  isDirty?: boolean;
  onResize?: (url: string, width: any, height: any) => void;
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
  onResize,
}: Props) {
  const [content, setcontent] = useState(value);
  const { mode } = useTheme();
  const editorRef = useRef<RichMarkdownEditor | null>(null);
  const findEmbedNode = (
    url: string,
    node: Node
  ): { embedNode: Node | null; position?: number } => {
    let embedNode: Node | null = null;
    let position: number | undefined;
    if (!(node as any).content) return { embedNode, position };

    (node as any).content.descendants((childNode: any, pos: number) => {
      if (embedNode) return;

      if (childNode.type.name === "embed" && childNode.attrs.href === url) {
        embedNode = childNode;
        position = pos;
        return false;
      }

      return true;
    });

    return { embedNode, position };
  };

  const findEmbedInEditor = (
    url: string
  ): { embedNode: Node | null; position?: number } | null => {
    if (!editorRef.current) return null;
    const document = editorRef.current.view.state.doc;
    return findEmbedNode(url, document);
  };

  const replaceEmbedWithUrl = (
    editorState: EditorState,
    embedNode: Node,
    pos: number
  ) => {
    const urlText = (embedNode as any).attrs.href;
    console.log({ urlText });
    const newText = editorState.schema.text(urlText, [
      editorState.schema.marks.link.create({ href: urlText }),
    ]);
    const tr = editorState.tr.replaceWith(
      pos,
      pos + (embedNode as any).nodeSize,
      newText
    );
    console.log({ tr });
    return tr;
  };

  return (
    <Box
      onMouseLeave={() => {
        if (isDirty) {
          onSave && onSave(content as string);
        }
      }}
    >
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
        embeds={[
          // {
          //   title: "Embed",
          //   keywords: "embed",
          //   icon: () => (
          //     <Box
          //       style={{
          //         margin: "0.33rem",
          //       }}
          //     >
          //       <ImEmbed />
          //     </Box>
          //   ),
          //   matcher: () => {
          //     return true; // Match all URLs
          //   },
          //   component: ({ attrs }) =>
          //     GeneralEmbed({
          //       attrs,
          //       mode,
          //       findEmbedNode: (url: string) => {
          //         console.log({ url });
          //         const res = findEmbedInEditor(url);
          //         if (
          //           res &&
          //           res.embedNode &&
          //           (res.position || res.position === 0) &&
          //           editorRef.current
          //         ) {
          //           const { dispatch, state } = editorRef.current.view;
          //           const transaction = replaceEmbedWithUrl(
          //             state,
          //             res.embedNode,
          //             res.position
          //           );
          //           dispatch(transaction);
          //         }
          //       },
          //       resizeEmbed: (url: string, width: any, height: any) => {
          //         onResize && onResize(url, width, height);
          //       },
          //       resizeable: onResize ? true : false,
          //     }),
          // },
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
              console.log({ url });

              return /^https:\/\/miro\.com\/app\/board\/[0-9a-zA-Z]/.test(url);
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
