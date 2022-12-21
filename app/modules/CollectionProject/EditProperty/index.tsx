/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import Popover from "@/app/common/components/Popover";
import { deleteField } from "@/app/services/Collection";
import { CollectionType } from "@/app/types";
import { Box, Stack, Text, useTheme } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { Delete, Edit } from "react-feather";
import { toast } from "react-toastify";
import styled from "styled-components";
import AddField from "../../Collection/AddField";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { getPropertyIcon } from "./Utils";

type Props = {
  propertyName: string;
};

function EditProperty({ propertyName }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fieldInput = useRef<any>();
  const {
    localCollection: collection,
    updateCollection,
    setProjectViewId,
  } = useLocalCollection();
  const property = collection.properties[propertyName];
  const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
  const [showConfirmOnDelete, setshowConfirmOnDelete] = useState(false);

  const { mode } = useTheme();

  if (property) {
    return (
      <Box width="3/4" marginLeft="1">
        <AnimatePresence>
          {isEditFieldOpen && (
            <AddField
              handleClose={() => setIsEditFieldOpen(false)}
              propertyName={propertyName}
            />
          )}
          {showConfirmOnDelete && (
            <ConfirmModal
              title="This will remove existing data associated with this field, if you're looking to avoid this please set the field as inactive. Are you sure you want to delete this field?"
              handleClose={() => setshowConfirmOnDelete(false)}
              onConfirm={async () => {
                const res: CollectionType = await deleteField(
                  collection.id,
                  propertyName
                );
                if (res.id) {
                  setshowConfirmOnDelete(false);
                  res.projectMetadata &&
                    setProjectViewId(res.projectMetadata.viewOrder[0]);
                  updateCollection(res);
                } else {
                  toast.error("Error deleting field");
                }
              }}
              onCancel={() => setshowConfirmOnDelete(false)}
            />
          )}
        </AnimatePresence>
        <Popover
          isOpen={isMenuOpen}
          setIsOpen={setIsMenuOpen}
          dependentRef={fieldInput}
          butttonComponent={
            <Box width="full">
              <PropertyButton onClick={() => setIsMenuOpen(true)} mode={mode}>
                {getPropertyIcon(property.type)}
                {property.name}
                {property.required && <Box color="accent">*</Box>}
              </PropertyButton>
            </Box>
          }
        >
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto", transition: { duration: 0.2 } }}
            exit={{ height: 0 }}
            style={{
              overflow: "hidden",
              borderRadius: "0.25rem",
            }}
          >
            <Box backgroundColor="background">
              <MenuContainer>
                <Stack space="0">
                  <MenuItem
                    padding="2"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsEditFieldOpen(true);
                    }}
                  >
                    <Stack direction="horizontal" align="center">
                      <Text align="center">
                        <Edit size={16} />
                      </Text>
                      <Text align="center">Edit property</Text>
                    </Stack>
                  </MenuItem>
                  <MenuItem
                    padding="2"
                    onClick={() => {
                      setshowConfirmOnDelete(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    <Stack direction="horizontal" align="center">
                      <Text align="center">
                        <Delete size={16} />
                      </Text>
                      <Text align="center">Delete property</Text>
                    </Stack>
                  </MenuItem>
                </Stack>
              </MenuContainer>
            </Box>
          </motion.div>
        </Popover>
      </Box>
    );
  } else return null;
}

export default EditProperty;

const PropertyButton = styled.div<{ mode: string }>`
  color: ${({ mode }) =>
    mode === "dark" ? "rgb(255, 255, 255, 0.65)" : "rgb(0, 0, 0, 0.65)"};
  padding: 0.5rem 0.5rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-overflow: ellipsis;

  &:hover {
    cursor: pointer;
    background: rgb(191, 90, 242, 0.1);
  }

  transition: background 0.2s ease;
`;

const MenuContainer = styled(Box)`
  width: 15.5rem;
  background: rgb(191, 90, 242, 0.05);
  transition: all 0.15s ease-out;
`;

const MenuItem = styled(Box)`
  width: 100%;
  &:hover {
    cursor: pointer;
    background: rgb(191, 90, 242, 0.1);
  }
  transition: background 0.2s ease;
`;
