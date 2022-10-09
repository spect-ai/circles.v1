import React, { useState } from "react";
import Editor from "@/app/common/components/Editor";
import { Box } from "degen";

type Props = {
  focus: boolean;
  active: boolean;
  rowData: any;
  columnData: any;
  setRowData: any;
  stopEditing: any;
  isModalOpen?: boolean;
};

export default function LongTextComponent({
  focus,
  active,
  rowData,
  columnData,
  setRowData,
  stopEditing,
  isModalOpen,
}: Props) {
  const [dirty, setDirty] = useState(false);

  return (
    <Box overflow="hidden" padding="1">
      <Editor
        value={rowData}
        onSave={(value) => {
          console.log({ value });
          setRowData(value);
          stopEditing();
        }}
        placeholder={`Type here to edit ${columnData.name}`}
        isDirty={dirty}
        setIsDirty={setDirty}
      />
    </Box>
  );
}
