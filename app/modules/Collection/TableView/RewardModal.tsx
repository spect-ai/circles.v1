/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/app/common/components/Modal";
import { Reward } from "@/app/types";
import { Box } from "degen";
import { memo, useState } from "react";
import RewardField from "../../PublicForm/Fields/RewardField";

type Props = {
  form: any;
  value: any | undefined;
  propertyName: string;
  handleClose: (reward: Reward, dataId: string, propertyName: string) => void;
  dataId?: string;
};

const RewardModal = ({
  propertyName,
  handleClose,
  form,
  value,
  dataId,
}: Props) => {
  const [data, setData] = useState(value);

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
          propertyName
        );
      }}
      title="Reward"
    >
      <Box padding="8">
        <RewardField
          rewardOptions={form.properties[propertyName].rewardOptions}
          value={data}
          updateData={(reward: Reward) => {
            setData(reward);
          }}
        />
      </Box>
    </Modal>
  );
};

RewardModal.defaultProps = {
  dataId: "",
};

export default memo(RewardModal);
