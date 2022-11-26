/* eslint-disable @typescript-eslint/no-explicit-any */
import Drawer from "@/app/common/components/Drawer";
import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { addCollectionData } from "@/app/services/Collection";
import { Box, IconPlusSmall, Stack, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import AddField from "../../Collection/AddField";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import EditProperty from "../EditProperty";
import EditValue from "../EditValue";

type Props = {
  handleClose: () => void;
};

export default function CardDrawer({ handleClose }: Props) {
  const { mode } = useTheme();
  const { localCollection: collection } = useLocalCollection();
  const [value, setValue] = useState<any>({});

  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  return (
    <Box>
      <Drawer
        width="50%"
        handleClose={async () => {
          if (Object.keys(value).length > 0) {
            const res = await addCollectionData(collection.id, value);
            if (res.id) handleClose();
            else toast.error("Error adding card");
          } else handleClose();
        }}
      >
        <AnimatePresence>
          {isAddFieldOpen && (
            <AddField handleClose={() => setIsAddFieldOpen(false)} />
          )}
        </AnimatePresence>
        <Box paddingX="8" paddingY="4">
          <Stack space="1">
            <NameInput
              mode={mode}
              placeholder="Untitled"
              value={value.Title}
              onChange={(e) => setValue({ ...value, Title: e.target.value })}
            />
            {collection.propertyOrder.map((property) => {
              if (property !== "Title" && property !== "Description") {
                return (
                  <Box key={property}>
                    <Stack direction="horizontal">
                      <EditProperty propertyName={property} />
                      <EditValue
                        propertyName={property}
                        value={value[property]}
                        setValue={(val) => {
                          setValue({ ...value, [property]: val });
                        }}
                      />
                    </Stack>
                  </Box>
                );
              }
            })}
            <Box width="1/4">
              <PrimaryButton
                variant="tertiary"
                icon={<IconPlusSmall />}
                onClick={() => setIsAddFieldOpen(true)}
              >
                Add Field
              </PrimaryButton>
            </Box>
            <Box padding="2" borderTopWidth="0.375" marginTop="4">
              <Editor
                placeholder="Describe your card here...."
                value={value.Description}
                onSave={(val) => {
                  console.log({ val });
                  setValue({ ...value, Description: val });
                }}
                isDirty={isDirty}
                setIsDirty={setIsDirty}
              />
            </Box>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}

const NameInput = styled.input<{ mode: string }>`
  width: 100%;
  background: transparent;
  padding: 8px;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.9rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 700;
  ::placeholder {
    color: ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.1)"
        : "rgb(20, 20, 20, 0.5)"};
  }
  letter-spacing: 0.05rem;
`;
