import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import { Box, Stack } from "degen";
import React, { useState } from "react";

type Props = {
  propertyName: string;
  handleClose: (value: string) => void;
  value: string;
};

export default function LongTextModal({
  propertyName,
  handleClose,
  value,
}: Props) {
  const [isDirty, setIsDirty] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  return (
    <Modal title={propertyName} handleClose={() => handleClose(tempValue)}>
      <Box padding="8">
        <Stack>
          <Box padding="2" borderBottomWidth="0.375" marginTop="4">
            <Editor
              placeholder="Describe your card here...."
              value={tempValue}
              onSave={(val) => {
                setTempValue(val);
              }}
              onChange={() => {
                setIsDirty(true);
              }}
              isDirty={isDirty}
              setIsDirty={setIsDirty}
              version={2}
            />
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
