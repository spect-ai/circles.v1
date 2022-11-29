import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Stack, Tag, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { Hidden, Visible } from "react-grid-system";
import { toast } from "react-toastify";
import { PopoverOption } from "../../Card/OptionPopover";
import { useLocalCollection } from "../Context/LocalCollectionContext";

export const Embed = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState(0);

  const { localCollection: collection } = useLocalCollection();
  return (
    <Box position="relative">
      <Visible xs sm>
        <PopoverOption
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Embed
        </PopoverOption>
      </Visible>
      <Hidden xs sm>
        <PrimaryButton variant="tertiary" onClick={() => setIsOpen(true)}>
          Embed
        </PrimaryButton>
      </Hidden>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Embed form" handleClose={() => setIsOpen(false)}>
            <Box padding="8">
              <Stack>
                <Text variant="label">Background Color</Text>
                <Stack direction="horizontal" space="4" align="center">
                  <Box cursor="pointer" onClick={() => setSelectedMode(0)}>
                    <Tag tone={selectedMode === 0 ? "accent" : undefined} hover>
                      Transparent
                    </Tag>
                  </Box>
                  <Box cursor="pointer" onClick={() => setSelectedMode(1)}>
                    <Tag tone={selectedMode === 1 ? "accent" : undefined} hover>
                      Dark
                    </Tag>
                  </Box>
                  <Box cursor="pointer" onClick={() => setSelectedMode(2)}>
                    <Tag tone={selectedMode === 2 ? "accent" : undefined} hover>
                      Light
                    </Tag>
                  </Box>
                </Stack>
                <PrimaryButton
                  onClick={async () => {
                    const color =
                      selectedMode === 0
                        ? "transparent"
                        : selectedMode === 1
                        ? "rgb(20,20,20)"
                        : "rgb(255,255,255)";
                    await navigator.clipboard.writeText(
                      `https://circles.spect.network/r/${collection?.slug}/embed?bgcolor=${color}`
                    );
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
        )}
      </AnimatePresence>
    </Box>
  );
};
