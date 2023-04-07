import { Box, Stack, Text } from "degen";
import React from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Modal from "../Modal";
import ClickableTag from "./ClickableTag";

type Props = {
  name: string;
  modalTitle: string;
  children: React.ReactNode;
  label?: string;
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  tourId?: string;
  handleClose: () => void;
};

const EditTag = ({
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
}: Props) => (
  <Box>
    <Stack
      direction={{
        sm: "vertical",
        md: "horizontal",
      }}
    >
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

export default EditTag;

export type { Props as EditTagProps };
