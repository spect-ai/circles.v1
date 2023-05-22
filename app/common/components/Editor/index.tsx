import { Box, useTheme } from "degen";
import React, { memo, useState } from "react";
// import { Editor as RichEditor } from "@avp1598/react-beautiful-editor";
import { storeImage } from "../../utils/ipfs";
import dynamic from "next/dynamic";
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
}: Props) {
  const [content, setcontent] = useState(value);
  const { mode } = useTheme();
  return (
    <Box
      onMouseLeave={() => {
        if (isDirty) {
          onSave && onSave(content as string);
        }
      }}
      color="text"
    >
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
    </Box>
  );
}

export default memo(Editor);
export type { Props as EditorProps };
