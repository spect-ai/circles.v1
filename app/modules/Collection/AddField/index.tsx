import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { addField } from "@/app/services/Collection";
import { Box, Input, Stack } from "degen";
import React, { useState } from "react";
import { fields } from "../Constants";
import { useLocalCollection } from "../Context/LocalCollectionContext";

export default function AddField() {
  const [isOpen, setIsOpen] = useState(false);
  const { localCollection: collection } = useLocalCollection();

  const [name, setName] = useState("");
  const [type, setType] = useState({ label: "Text", value: "text" });
  const [loading, setLoading] = useState(false);
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
              <Input
                label=""
                placeholder="Field Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Dropdown
                options={fields}
                selected={type}
                onChange={() => {
                  setType(type);
                }}
              />
              <PrimaryButton
                loading={loading}
                onClick={async () => {
                  setLoading(true);
                  const res = await addField(collection.id, name, type.value);
                  setLoading(false);
                  setIsOpen(false);
                  console.log({ res });
                }}
              >
                Save
              </PrimaryButton>
            </Stack>
          </Box>
        </Modal>
      )}
    </>
  );
}
