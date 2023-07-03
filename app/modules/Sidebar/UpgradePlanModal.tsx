import Modal from "@/app/common/components/Modal";
import Subscription from "./Subscription";

type Props = {
  handleClose: () => void;
};

const UpgradePlan = ({ handleClose }: Props) => {
  return (
    <Modal title="" handleClose={handleClose}>
      <Subscription handleClose={handleClose} />
    </Modal>
  );
};

export default UpgradePlan;
