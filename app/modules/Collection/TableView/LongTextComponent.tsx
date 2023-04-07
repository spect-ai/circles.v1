/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Editor from "@/app/common/components/Editor";
import { Box } from "degen";
import { useLocalCollection } from "../Context/LocalCollectionContext";

type Props = {
  rowData: any;
  columnData: any;
  setRowData: any;
  stopEditing: any;
};

const LongTextComponent = ({
  rowData,
  columnData,
  setRowData,
  stopEditing,
}: Props) => {
  const { localCollection: collection } = useLocalCollection();
  const [dirty, setDirty] = useState(false);

  return (
    <Box overflow="hidden" padding="1">
      <Editor
        value={rowData}
        onSave={(value) => {
          setRowData(value);
          stopEditing();
        }}
        placeholder=""
        isDirty={dirty}
        setIsDirty={setDirty}
        disabled={
          collection.collectionType === 0 ? columnData.isPartOfFormView : false
        }
      />
    </Box>
  );
};

export default LongTextComponent;
