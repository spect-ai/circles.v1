/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Editor from "@/app/common/components/Editor";
import { Box } from "degen";
import { useLocalCollection } from "../Context/LocalCollectionContext";

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
  rowData,
  columnData,
  setRowData,
  stopEditing,
}: Props) {
  const { localCollection: collection } = useLocalCollection();
  const [dirty, setDirty] = useState(false);

  return (
    <Box overflow="hidden" padding="1">
      <Editor
        value={rowData || ""}
        onSave={(value) => {
          setRowData(value);
          stopEditing();
        }}
        placeholder={``}
        isDirty={dirty}
        setIsDirty={setDirty}
        disabled={
          collection.collectionType === 0 ? columnData.isPartOfFormView : false
        }
      />
    </Box>
  );
}
