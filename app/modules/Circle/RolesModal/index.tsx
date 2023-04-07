import Modal from "@/app/common/components/Modal";
import Roles from "./Roles";

type Props = {
  handleClose: () => void;
};

const RolesModal = ({ handleClose }: Props) => (
  <Modal title="Roles" handleClose={handleClose} zIndex={2}>
    <Roles />
  </Modal>
);

export default RolesModal;
