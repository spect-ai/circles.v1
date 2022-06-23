import { Box, Button, Stack, Text } from "degen";
import React from "react";
import Modal from ".";
import PrimaryButton from "../PrimaryButton";

type Props = {
  title?: string;
  handleClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function ConfirmModal({
  title,
  handleClose,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal title="Confirm?" handleClose={handleClose}>
      <Box paddingX="8" paddingY="4">
        <Stack>
          <Text variant="large" weight="semiBold">
            {title}
          </Text>
          <Stack direction="horizontal">
            <Box width="full">
              <PrimaryButton onClick={onCancel}>Cancel</PrimaryButton>
            </Box>
            <Box width="full">
              <PrimaryButton onClick={onConfirm}>Confirm</PrimaryButton>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
