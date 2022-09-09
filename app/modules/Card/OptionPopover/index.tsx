import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import Popover from "@/app/common/components/Popover";
import { ShareAltOutlined, TwitterOutlined } from "@ant-design/icons";
import {
  Box,
  IconDotsHorizontal,
  IconDuplicate,
  IconTrash,
  Stack,
  Text,
  useTheme,
} from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { TwitterShareButton } from "react-share";
import styled from "styled-components";
import { useCircle } from "../../Circle/CircleContext";
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

const PopoverOptionContainer = styled(Box)<{ mode: string }>`
  &:hover {
    // background-color: rgba(255, 255, 255, 0.1);
    background-color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 20, 20, 0.1)"};
  }
`;

type PopoverOptionProps = {
  onClick: (e?: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
  tourId?: string;
};

export const PopoverOption = ({
  children,
  onClick,
  tourId,
}: PopoverOptionProps) => {
  const { mode } = useTheme();

  return (
    <PopoverOptionContainer
      padding="4"
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
      borderRadius="2xLarge"
      data-tour={tourId}
      mode={mode}
    >
      <Text variant="small" weight="semiBold" ellipsis color="textSecondary">
        {children}
      </Text>
    </PopoverOptionContainer>
  );
};

export default function ActionPopover() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { onArchive, cardId } = useLocalCard();
  const { circle } = useCircle();

  return (
    <>
      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal
            title="Are you sure you want to archive this card?"
            handleClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              void onArchive(cardId);
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
            {/* <PopoverOption onClick={() => {}}>
              <Stack direction="horizontal" space="2">
                <IconDuplicate />
                Duplicate
              </Stack>
            </PopoverOption> */}
            <PopoverOption onClick={() => {}}>
              <TwitterShareButton
                url={"https://circles.spect.network/"}
                title={`Creating magic for ${circle?.name} on Spect!`}
              >
                <Stack direction="horizontal" space="2">
                  <TwitterOutlined
                    style={{
                      fontSize: "1.5rem",
                    }}
                  />
                  Share
                </Stack>
              </TwitterShareButton>
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
