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
    />
  );
}

export default memo(Editor);

export type { Props as EditorProps };
