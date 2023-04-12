import RichMarkdownEditor from "rich-markdown-editor";
import { toast } from "react-toastify";
import dark, { light } from "./styles/theme";
import { storeImage } from "../../utils/ipfs";
import React, { memo, useState } from "react";
import { useTheme } from "degen";

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

  return (
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
          title: "YouTube",
          keywords: "youtube video",
          icon: () => (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M9 16.17V7.83L15.17 12 9 16.17zM15 3H9v2h6v12h2V3z" />
            </svg>
          ),
          matcher: (url) => {
            if (!url) return false;
            return url.match(
              /^https?:\/\/(www\.)?(youtube\.com|youtu\.?be)\/.+/
            ) as RegExpMatchArray;
          },
          component: ({ url }) => {
            console.log({ url });
            if (!url) return null;
            const id = url.match(
              /^https?:\/\/(www\.)?(youtube\.com|youtu\.?be)\/.+/
            )?.[0];
            console.log({ id });
            return (
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            );
          },
        },
      ]}
    />
  );
}

export default memo(Editor);

export type { Props as EditorProps };
