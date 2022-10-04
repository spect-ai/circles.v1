import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Input, Stack } from "degen";
import React, { useState } from "react";
import { fields } from "../Constants";

export default function AddField() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <PrimaryButton onClick={() => setIsOpen(true)}>Add Field</PrimaryButton>
      {isOpen && (
        <Modal
          title="Add Field"
          handleClose={() => setIsOpen(false)}
          size="small"
        >
          <Box padding="8">
            <Stack>
              <Input label="" placeholder="Field Name" />
              <Dropdown
                options={fields}
                selected={{ label: "Text", value: "text" }}
                onChange={() => {}}
              />
              <PrimaryButton>Save</PrimaryButton>
            </Stack>
          </Box>
        </Modal>
      )}
    </>
  );
}
