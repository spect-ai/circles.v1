import { Box, Button, FileInput, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import {
  BsBrushFill,
  BsDroplet,
  BsFileBreakFill,
  BsFillEyeFill,
  BsFillGearFill,
  BsFillPlugFill,
  BsPenFill,
  BsShareFill,
} from "react-icons/bs";
import { FaPlug } from "react-icons/fa";
import styled from "styled-components";
import FormSettings from "../FormSettings";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { PluginType, spectPlugins } from "@/app/modules/Plugins/Plugins";
import { isPluginAdded } from "@/app/modules/Plugins/ViewPlugins";

type Props = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active: boolean;
  suffix?: React.ReactNode;
};

const LabelText = styled.div`
  font-size: 13px;
  color: #8e8e8e;
`;
export const HeaderButton = ({
  icon,
  label,
  onClick,
  active,
  suffix,
}: Props) => {
  return (
    <Box position="relative">
      <Button variant={active ? "tertiary" : "transparent"} onClick={onClick}>
        <Stack align="center" space="1">
          <Text color="accent">{icon}</Text>
          <LabelText>{label}</LabelText>
        </Stack>
        <Box position="absolute" right="2" top="0">
          {suffix}
        </Box>
      </Button>
    </Box>
  );
};

const EditorHeader = ({
  setViewPage,
  viewPage,
}: {
  setViewPage: (page: string) => void;
  viewPage: string;
}) => {
  const { localCollection: collection } = useLocalCollection();
  const [numPluginsAdded, setNumPlugnsAdded] = useState(0);

  useEffect(() => {
    setNumPlugnsAdded(
      Object.keys(spectPlugins).filter((pluginName) =>
        isPluginAdded(pluginName as PluginType, collection)
      )?.length
    );
  }, [collection.formMetadata]);
  return (
    <Box paddingY="4" overflow="auto" width="full">
      <Stack direction="horizontal" space="2" justify="center">
        {/* <FileInput
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
        </FileInput> */}
        <HeaderButton
          icon={<BsFileBreakFill size={20} />}
          label="Editor"
          onClick={() => {
            setViewPage("editor");
          }}
          active={viewPage === "editor"}
        />
        <HeaderButton
          icon={<BsBrushFill size={20} />}
          label="Design"
          onClick={() => {
            setViewPage("design");
          }}
          active={viewPage === "design"}
        />
        <Box borderLeftWidth="0.375" height="14" />
        <a href={`/r/${collection?.slug}`} target="_blank" rel="noreferrer">
          <HeaderButton
            icon={<BsFillEyeFill size={20} />}
            label="Preview"
            onClick={() => {}}
            active={false}
          />
        </a>
        <HeaderButton
          icon={<BsShareFill size={20} />}
          label="Share"
          onClick={() => {
            setViewPage("share");
          }}
          active={viewPage === "share"}
        />
        <Box borderLeftWidth="0.375" height="14" />
        {/* <HeaderButton
              icon={<AiFillDatabase size={20} />}
              label="Responses"
              onClick={() => {}}
            /> */}
        <HeaderButton
          icon={<BsFillPlugFill size={20} />}
          label="Plugins"
          onClick={() => {
            setViewPage("plugins");
          }}
          active={viewPage === "plugins"}
          suffix={
            numPluginsAdded > 0 ? (
              <Box
                backgroundColor="accentSecondary"
                borderRadius="full"
                paddingX="2"
                paddingY="0.5"
                display="flex"
                alignItems="center"
              >
                <Text size="extraSmall" color="accent">
                  {numPluginsAdded}
                </Text>
              </Box>
            ) : null
          }
        />
        <HeaderButton
          icon={<BsFillGearFill size={20} />}
          label="Settings"
          onClick={() => {
            setViewPage("settings");
          }}
          active={viewPage === "settings"}
        />
        {/* <FormSettings headerButton /> */}
      </Stack>
    </Box>
  );
};

export default EditorHeader;
