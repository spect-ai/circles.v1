/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/app/common/components/Modal";
import { Reward } from "@/app/types";
import { Box } from "degen";
import { memo, useState } from "react";
import RewardField from "../../PublicForm/Fields/RewardField";
import { useCircle } from "../../Circle/CircleContext";

type Props = {
  form: any;
  value: any | undefined;
  dataId?: string;
  propertyId: string;
  handleClose: (reward: Reward, dataId: string, propertyId: string) => void;
};

function RewardModal({ propertyId, dataId, handleClose, form, value }: Props) {
  const [data, setData] = useState(value);
  const { registry } = useCircle();

  return (
    <Modal
      handleClose={() => {
        handleClose(
          {
            chain: data?.chain,
            token: data?.token,
            value: data?.value,
          },
          dataId || "",
          propertyId
        );
      }}
      title="Reward"
      size="small"
    >
      <Box padding="8">
        <RewardField
          rewardOptions={
            form.collectionType === 0
              ? form.properties[propertyId].rewardOptions
              : registry
          }
          value={data}
          updateData={(reward: Reward) => {
            setData(reward);
          }}
        />
      </Box>
    </Modal>
  );
}

export default memo(RewardModal);
