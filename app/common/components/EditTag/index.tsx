import { Box, Stack, Text } from "degen";
import React from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "../Modal";
import ClickableTag from "./ClickableTag";
import { toast } from "react-toastify";

type Props = {
  name: string;
  modalTitle: string;
  children: React.ReactNode;
  label?: string;
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  icon?: React.ReactNode;
  tone?: string;
  disabled?: boolean;
  tourId?: string;
  handleClose: () => void;
};

function EditTag({
  name,
  modalTitle,
  children,
  label,
  modalOpen,
  icon,
  setModalOpen,
  disabled = false,
  tourId,
  handleClose,
}: Props) {
  return (
    <Box>
      <Stack direction="horizontal">
        {label && (
          <Box width="1/3">
            <Text variant="label">{label}</Text>
          </Box>
        )}
        <Box width={label ? "2/3" : "full"}>
          <ClickableTag
            tourId={tourId}
            name={name}
            icon={icon}
            onClick={() => {
              if (disabled) {
                toast.error("Cannot edit");
                return;
              }
              setModalOpen(true);
            }}
          />
        </Box>
      </Stack>
      <AnimatePresence
        initial={false}
        exitBeforeEnter
        onExitComplete={() => null}
      >
        {modalOpen && (
          <Modal handleClose={handleClose} title={modalTitle}>
            {children}
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default EditTag;

export type { Props as EditTagProps };
