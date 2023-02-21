import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Stack, Tag, Text, useTheme } from "degen";
import React, { useState } from "react";
import { Copy, HelpCircle } from "react-feather";
import { Tooltip } from "react-tippy";
import { toast } from "react-toastify";
import { useLocalCollection } from "../Context/LocalCollectionContext";

type EmbedProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  component: "form" | "members";
  routeId: string;
};

export const Embed = ({
  isOpen,
  setIsOpen,
  component,
  routeId,
}: EmbedProps) => {
  const [selectedMode, setSelectedMode] = useState(0);
  const { mode } = useTheme();
  return (
    <Modal
      title={`Embed ${component}`}
      handleClose={() => setIsOpen(false)}
      size="small"
    >
      <Box padding="8">
        <Stack>
          <Stack direction="horizontal" align="center" space="2">
            <Text variant="label">Color Mode</Text>
            <Box cursor="pointer" display="flex" alignItems="center">
              <Text variant="label">
                <Tooltip
                  title="Select dark mode if you are embedding it on a dark background or light mode if you are embedding it on a light background"
                  theme={mode}
                  position="top"
                >
                  <HelpCircle size={16} />
                </Tooltip>
              </Text>
            </Box>
          </Stack>
          <Stack direction="horizontal" space="4" align="center">
            <Box cursor="pointer" onClick={() => setSelectedMode(0)}>
              <Tag tone={selectedMode === 0 ? "accent" : undefined} hover>
                Dark
              </Tag>
            </Box>
            <Box cursor="pointer" onClick={() => setSelectedMode(1)}>
              <Tag tone={selectedMode === 1 ? "accent" : undefined} hover>
                Light
              </Tag>
            </Box>
          </Stack>
          <PrimaryButton
            icon={<Copy size={18} />}
            onClick={async () => {
              const colorMode = selectedMode === 0 ? "dark" : "light";
              if (component === "form") {
                await navigator.clipboard.writeText(
                  `https://circles-v1-production.vercel.app/r/${routeId}/embed?mode=${colorMode}`
                );
              } else {
                await navigator.clipboard.writeText(
                  `https://circles-v1-production.vercel.app/${routeId}/embed?mode=${colorMode}&tab=membership`
                );
              }
              toast.success(
                "Copied to clipboard, paste it on any website which supports embed"
              );
              setIsOpen(false);
            }}
          >
            Copy Link
          </PrimaryButton>
        </Stack>
      </Box>
    </Modal>
  );
};
