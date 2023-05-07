import { storeImage } from "@/app/common/utils/ipfs";
import { updateFormCollection } from "@/app/services/Collection";
import { Box, Button, FileInput, Stack, Text } from "degen";
import React, { useRef } from "react";
import {
  AiFillDatabase,
  AiFillSetting,
  AiOutlineEye,
  AiOutlinePlus,
} from "react-icons/ai";
import { BsDroplet, BsHexagon, BsShareFill } from "react-icons/bs";
import { FaPager, FaPlug } from "react-icons/fa";
import { HiOutlineDocument } from "react-icons/hi";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { toast } from "react-toastify";
import FormSettings from "../FormSettings";

type Props = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

const LabelText = styled.div`
  font-size: 13px;
  color: #8e8e8e;
`;
export const HeaderButton = ({ icon, label, onClick }: Props) => {
  return (
    <Button variant="transparent" onClick={onClick}>
      <Stack align="center" space="1">
        <Text color="accent">{icon}</Text>
        <LabelText>{label}</LabelText>
      </Stack>
    </Button>
  );
};

const EditorHeader = ({
  setEditMode,
}: {
  setEditMode: (editMode: boolean) => void;
}) => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  return (
    <Box paddingY="4">
      <Stack direction="horizontal" space="2" justify="center">
        {/* <HeaderButton
              icon={<AiOutlinePlus size={20} />}
              label="Field"
              onClick={() => {}}
            />
            <HeaderButton
              icon={<HiOutlineDocument size={20} />}
              label="Page"
              onClick={() => {}}
            />
            <Box borderLeftWidth="0.375" height="14" /> */}
        <FileInput
          accept="image/*"
          ref={logoInputRef}
          onChange={async (file) => {
            const res = await storeImage(file);
            const newCollection = await updateFormCollection(collection.id, {
              formMetadata: {
                ...collection.formMetadata,
                logo: res.imageGatewayURL,
              },
            });
            if (!newCollection.id) {
              toast.error("Error updating collection, refresh and try again");
            } else updateCollection(newCollection);
          }}
        >
          {() => (
            <HeaderButton
              icon={<BsHexagon size={20} />}
              label="Logo"
              onClick={() => {
                const grandChildrenInput =
                  logoInputRef.current?.querySelector("input");
                grandChildrenInput?.click();
              }}
            />
          )}
        </FileInput>
        <FileInput
          accept="image/*"
          ref={coverInputRef}
          onChange={async (file) => {
            const res = await storeImage(file);
            const newCollection = await updateFormCollection(collection.id, {
              formMetadata: {
                ...collection.formMetadata,
                cover: res.imageGatewayURL,
              },
            });
            if (!newCollection.id) {
              toast.error("Error updating collection, refresh and try again");
            } else updateCollection(newCollection);
          }}
        >
          {() => (
            <HeaderButton
              icon={<FaPager size={20} />}
              label="Cover"
              onClick={() => {
                const grandChildrenInput =
                  coverInputRef.current?.querySelector("input");
                grandChildrenInput?.click();
              }}
            />
          )}
        </FileInput>
        {/* <HeaderButton
              icon={<BsDroplet size={20} />}
              label="Design"
              onClick={() => {}}
            /> */}
        <Box borderLeftWidth="0.375" height="14" />
        <HeaderButton
          icon={<AiOutlineEye size={20} />}
          label="Preview"
          onClick={() => {
            setEditMode(false);
          }}
        />
        {/* <HeaderButton
              icon={<BsShareFill size={20} />}
              label="Share"
              onClick={() => {}}
            /> */}
        <Box borderLeftWidth="0.375" height="14" />
        {/* <HeaderButton
              icon={<AiFillDatabase size={20} />}
              label="Responses"
              onClick={() => {}}
            />
            <HeaderButton
              icon={<FaPlug size={20} />}
              label="Plugins"
              onClick={() => {}}
            /> */}
        <FormSettings headerButton />
      </Stack>
    </Box>
  );
};

export default EditorHeader;
