import React from "react";
import RichMarkdownEditor from "rich-markdown-editor";
import { toast } from "react-toastify";
import dark from "./styles/theme";
import { storeImage } from "../../utils/ipfs";

type Props = {
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  tourId?: string;
};

function Editor({
  value,
  onChange,
  placeholder,
  disabled,
  tourId,
  onBlur,
}: Props) {
  return (
    <RichMarkdownEditor
      data-tour={tourId}
      dark
      theme={dark}
      disableExtensions={[]}
      defaultValue={value}
      onChange={(val) => onChange(val())}
      onImageUploadStop={() => {
        toast("Uploaded", {
          theme: "dark",
        });
      }}
      placeholder={placeholder}
      uploadImage={async (file) => {
        const { imageGatewayURL } = await storeImage(file, "circleLogo");
        console.log({ imageGatewayURL });
        return imageGatewayURL;
      }}
      readOnly={disabled || false}
      onBlur={onBlur}
    />
  );
}

export default Editor;

export type { Props as EditorProps };
