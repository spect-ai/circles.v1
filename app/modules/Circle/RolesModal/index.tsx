import Modal from "@/app/common/components/Modal";
import Roles from "./Roles";

type Props = {
  handleClose: () => void;
};

export default function RolesModal({ handleClose }: Props) {
  return (
    <Modal title="Roles" handleClose={handleClose} zIndex={2}>
      <Roles />
    </Modal>
  );
}
