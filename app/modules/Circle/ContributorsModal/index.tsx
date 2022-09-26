import Modal from "@/app/common/components/Modal";
import { Box } from "degen";
import React from "react";
import Contributors from "./Contributors";

type Props = {
  handleClose: () => void;
};

export default function ContributorsModal({ handleClose }: Props) {
  return (
    <Modal title="Contributors" handleClose={handleClose} height="40rem" zIndex={2}>
      <Box padding="6">
        <Contributors />
      </Box>
    </Modal>
  );
}
