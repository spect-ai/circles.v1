import { Box, Stack, Text } from "degen";
import Modal from ".";
import PrimaryButton from "../PrimaryButton";

type Props = {
  title?: string;
  handleClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const ConfirmModal = ({ title, handleClose, onConfirm, onCancel }: Props) => (
  <Modal title="Confirm?" handleClose={handleClose} zIndex={3} size="small">
    <Box paddingX="8" paddingY="4">
      <Stack>
        <Text variant="large" weight="semiBold">
          {title}
        </Text>
        <Stack direction="horizontal">
          <Box width="full">
            <PrimaryButton onClick={onCancel} variant="tertiary">
              Cancel
            </PrimaryButton>
          </Box>
          <Box width="full">
            <PrimaryButton onClick={onConfirm}>Yes</PrimaryButton>
          </Box>
        </Stack>
      </Stack>
    </Box>
  </Modal>
);

export default ConfirmModal;
