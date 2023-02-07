import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Stack, Text } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import styled from "styled-components";
import { useCircle } from "../Circle/CircleContext";
import { useLocalCollection } from "../Collection/Context/LocalCollectionContext";
import SybilResistance from "./gtcpassport";
import RoleGate from "./guildxyz";
import SendKudos from "./mintkudos";
import { SpectPlugin, spectPlugins } from "./Plugins";

type Props = {};

export default function ViewPlugins({}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPluginOpen, setIsPluginOpen] = useState(false);
  const [pluginOpen, setPluginOpen] = useState("");

  const { localCollection: collection } = useLocalCollection();

  const onClick = (pluginName: string) => {
    switch (pluginName) {
      case "guildxyz":
        setIsPluginOpen(true);
        setPluginOpen(pluginName);
        break;
      case "gtcpassport":
        setIsPluginOpen(true);
        setPluginOpen(pluginName);

      case "mintkudos":
        setIsPluginOpen(true);
        setPluginOpen(pluginName);
      default:
        break;
    }
  };

  const isPluginAdded = (pluginName: string) => {
    switch (pluginName) {
      case "guildxyz":
        return !!collection.formMetadata.formRoleGating;
      case "gtcpassport":
        return collection.formMetadata.sybilProtectionEnabled;
      default:
        return false;
    }
  };

  return (
    <Box>
      <PrimaryButton
        onClick={() => {
          setIsOpen(true);
        }}
      >
        View Plugins
      </PrimaryButton>
      <AnimatePresence>
        {isOpen && (
          <Modal
            handleClose={() => setIsOpen(false)}
            title="Plugins"
            size="large"
            key="plugins"
          >
            <Box padding="8">
              <Stack>
                <Text variant="label">Added Plugins</Text>
                <Stack direction="horizontal" wrap space="4">
                  {Object.keys(spectPlugins).map((pluginName) => (
                    <PluginCard
                      key={pluginName}
                      plugin={spectPlugins[pluginName]}
                      onClick={() => onClick(pluginName)}
                      added={isPluginAdded(pluginName)}
                    />
                  ))}
                </Stack>
                <Text variant="label">All Plugins</Text>
                <Stack direction="horizontal" wrap space="4">
                  {Object.keys(spectPlugins).map((pluginName) => (
                    <PluginCard
                      key={pluginName}
                      plugin={spectPlugins[pluginName]}
                      onClick={() => onClick(pluginName)}
                    />
                  ))}
                </Stack>
              </Stack>
            </Box>
          </Modal>
        )}
        {isPluginOpen && pluginOpen === "guildxyz" && (
          <RoleGate handleClose={() => setIsPluginOpen(false)} key="guildxyz" />
        )}
        {isPluginOpen && pluginOpen === "gtcpassport" && (
          <SybilResistance
            handleClose={() => setIsPluginOpen(false)}
            key="gtcpassport"
          />
        )}
        {isPluginOpen && pluginOpen === "mintkudos" && (
          <SendKudos
            handleClose={() => setIsPluginOpen(false)}
            key="mintkudos"
          />
        )}
      </AnimatePresence>
    </Box>
  );
}

const PluginCard = ({
  plugin,
  onClick,
  added,
}: {
  plugin: SpectPlugin;
  onClick: () => void;
  added?: boolean;
}) => {
  if ((added !== undefined && added === true) || added === undefined) {
    return (
      <PluginContainer
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        <PluginImage src={plugin.image} />
        <Box padding="4">
          <Stack>
            <Text weight="bold">{plugin.name}</Text>
            <Text>{plugin.description}</Text>
            <a href={plugin.docs} target="_blank">
              <Text color="accent">View Docs</Text>
            </a>
          </Stack>
        </Box>
      </PluginContainer>
    );
  }
  return null;
};

const PluginContainer = styled(motion.div)`
  width: calc(100% / 3 - 1rem);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
`;

const PluginImage = styled.img`
  width: 100%;
  height: 14rem;
  object-fit: cover;
  border-radius: 1rem 1rem 0 0;
`;
