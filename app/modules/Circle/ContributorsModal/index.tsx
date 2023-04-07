import Modal from "@/app/common/components/Modal";
import { Box } from "degen";
import Contributors from "./Contributors";

type Props = {
  handleClose: () => void;
};

const ContributorsModal = ({ handleClose }: Props) => (
  <Modal
    title="Contributors"
    handleClose={handleClose}
    height="40rem"
    zIndex={2}
  >
    <Box padding="6">
      <Contributors />
    </Box>
  </Modal>
);

export default ContributorsModal;
