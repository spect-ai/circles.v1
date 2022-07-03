import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import Popover from "@/app/common/components/Popover";
import { ShareAltOutlined } from "@ant-design/icons";
import {
  Box,
  IconDotsHorizontal,
  IconDuplicate,
  IconTrash,
  Stack,
  Text,
} from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import styled from "styled-components";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  max-height: 14rem;
  overflow-y: auto;
`;

const PopoverOptionContainer = styled(Box)`
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

type PopoverOptionProps = {
  onClick: () => void;
  children: React.ReactNode;
};

export const PopoverOption = ({ children, onClick }: PopoverOptionProps) => (
  <PopoverOptionContainer
    padding="4"
    overflow="hidden"
    cursor="pointer"
    onClick={onClick}
    borderRadius="2xLarge"
  >
    <Text variant="small" weight="semiBold" ellipsis color="textSecondary">
      {children}
    </Text>
  </PopoverOptionContainer>
);

export default function ActionPopover() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { onArchive } = useLocalCard();
  return (
    <>
      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal
            title="Are you sure you want to archive this card?"
            handleClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              void onArchive();
            }}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </AnimatePresence>
      <Box width="fit">
        <Popover
          butttonComponent={
            <Box
              cursor="pointer"
              onClick={() => setIsOpen(!isOpen)}
              color="foreground"
            >
              <IconDotsHorizontal color="textSecondary" />
            </Box>
          }
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        >
          <ScrollContainer
            backgroundColor="background"
            borderWidth="0.5"
            borderRadius="2xLarge"
          >
            <PopoverOption onClick={() => {}}>
              <Stack direction="horizontal" space="2">
                <IconDuplicate />
                Duplicate
              </Stack>
            </PopoverOption>
            <PopoverOption onClick={() => {}}>
              <Stack direction="horizontal" space="2">
                <ShareAltOutlined
                  style={{
                    fontSize: "1.5rem",
                  }}
                />
                Share
              </Stack>
            </PopoverOption>
            <PopoverOption
              onClick={() => {
                setIsOpen(false);
                setShowConfirm(true);
              }}
            >
              <Stack direction="horizontal" space="2">
                <IconTrash color="red" />
                Archive
              </Stack>
            </PopoverOption>
          </ScrollContainer>
        </Popover>
      </Box>
    </>
  );
}
