import { TwitterOutlined, YoutubeFilled } from "@ant-design/icons";
import { Box, useTheme } from "degen";
import React, { memo, useRef, useState } from "react";
import { FaFigma } from "react-icons/fa";
import { SiLoom, SiMiro } from "react-icons/si";
import { toast } from "react-toastify";

import { storeImage } from "../../utils/ipfs";
import FigmaEmbed from "../Embeds/FigmaEmbed";
import LoomEmbed from "../Embeds/LoomEmbed";
import MiroEmbed from "../Embeds/MiroEmbed";
import TweetEmbed, { extractTweetId } from "../Embeds/TwitterEmbed";
import YouTubeEmbed from "../Embeds/YoutubeEmbed";
import dark, { light } from "./styles/theme";
import { TextSelection } from "prosemirror-state";
import { isURL } from "../../utils/utils";
import RichMarkdownEditor from "rich-markdown-editor";

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
  onFocus?: () => void;
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
  onFocus,
}: Props) {
  const [content, setcontent] = useState(value);
  const { mode } = useTheme();
  const editorRef = useRef<RichMarkdownEditor | null>(null);
  const [dropdownPosition, setDropdownPosition] =
    useState<{ top: number; left: number } | null>(null);
  const [pastedData, setPastedData] = useState<string | null>(null);

  const handlePaste = (view: any, event: any) => {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedData = clipboardData.getData("text");

    if (!pastedData) return false;
    if (!isURL(pastedData)) return false;
    const urlObj = new URL(pastedData);
    if (urlObj.searchParams.has("embedOnSpect")) return false;

    event.preventDefault();

    const rect = view.coordsAtPos(view.state.selection.from);

    setDropdownPosition({ top: rect.top, left: rect.left });
    setPastedData(pastedData);

    return true;
  };

  const handleEmbedSelect = (embed: boolean) => {
    if (!editorRef.current || !pastedData) return;

    const view = editorRef.current.view;
    let modifiedData = pastedData;
    if (embed && isURL(pastedData)) {
      const urlObj = new URL(pastedData);
      urlObj.searchParams.append("embedOnSpect", "true");
      modifiedData = urlObj.toString();

      // Create a link mark with the enriched URL
      const linkMark = view.state.schema.marks.link.create({
        href: modifiedData,
      });

      console.log({ state: view.state, linkMark });
      // Create a text node with the modified data and apply the link mark
      const linkNode = view.state.schema.text(modifiedData, [linkMark]);
      const newState = view.state.apply(
        view.state.tr.insert(view.state.selection.from, linkNode)
      );

      const newSelection = TextSelection.create(
        newState.doc,
        view.state.selection.from + modifiedData.length
      );

      console.log({ newState, newSelection });
      view.updateState(newState);
      view.dispatch(view.state.tr.setSelection(newSelection as any));
      view.focus();

      console.log({ val: editorRef.current.value() });

      // const editorValue = (editorRef.current as any).getContent();
      setcontent(editorRef.current.value());
    }

    setDropdownPosition(null);
    setPastedData(null);
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
        handleDOMEvents={
          {
            // paste: handlePaste,
          }
        }
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
        // onCreateLink={async (title) => {
        //   console.log({ title });

        //   return title;
        // }}
        // // extensions={[new YouTubeEmbedExtension()]}
        // onHoverLink={(event) => {
        //   console.log({ event });
        //   return true;
        // }}
        // onSearchLink={async (term) => {
        //   console.log({ term });
        //   return [
        //     {
        //       url: term,
        //       title: term,
        //       subtitle: term,
        //     },
        //   ];
        // }}
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
