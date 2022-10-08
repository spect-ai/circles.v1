import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { addField } from "@/app/services/Collection";
import { UserType } from "@/app/types";
import { Box, Input, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { fields } from "../Constants";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import AddOptions from "./AddOptions";

export default function AddField() {
  const [isOpen, setIsOpen] = useState(false);
  const { localCollection: collection } = useLocalCollection();

  const [name, setName] = useState("");
  const [type, setType] = useState({ label: "Short Text", value: "shortText" });
  const [loading, setLoading] = useState(false);
  const [fieldOptions, setFieldOptions] = useState([
    {
      label: "Option 1",
      value: "Option 1",
    },
  ]);

  const [userType, setUserType] = useState<UserType>();
  const [notifyUserType, setNotifyUserType] = useState<UserType[]>([]);
  return (
    <>
      <PrimaryButton onClick={() => setIsOpen(true)}>Add Field</PrimaryButton>
      <AnimatePresence>
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
                  onChange={(type) => {
                    setType(type);
                  }}
                />
                {type.value === "singleSelect" ||
                type.value === "multiSelect" ? (
                  <AddOptions
                    fieldOptions={fieldOptions}
                    setFieldOptions={setFieldOptions}
                  />
                ) : null}
                <PrimaryButton
                  loading={loading}
                  onClick={async () => {
                    setLoading(true);
                    const res = await addField(collection.id, {
                      name,
                      type: type.value,
                      isPartOfFormView: false,
                      options: fieldOptions,
                      userType,
                      onUpdateNotifyUserTypes: notifyUserType,
                    });
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
      </AnimatePresence>
    </>
  );
}
