/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@/app/common/components/Modal";
import { Milestone } from "@/app/types";
import { Box } from "degen";
import { memo, useState } from "react";
import MilestoneField from "../../PublicForm/Fields/MilestoneField";

type Props = {
  form: any;
  dataId: string;
  propertyId: string;
  handleClose: (value: Milestone[], dataId: string, propertyId: string) => void;
  disabled?: boolean;
};

function MultiMilestoneModal({
  propertyId,
  dataId,
  form,
  handleClose,
  disabled,
}: Props) {
  console;
  const [value, setValue] = useState(form.data[dataId]);

  return (
    <Modal
      handleClose={() => {
        value
          ? handleClose(value[propertyId], dataId, propertyId)
          : handleClose([], dataId, propertyId);
      }}
      title="Edit Milestones"
      size={form.collectionType === 0 ? "medium" : "small"}
    >
      <Box
        padding="8"
        width="full"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        gap="4"
      >
        <MilestoneField
          form={form}
          dataId={dataId}
          propertyId={propertyId}
          data={value}
          setData={setValue}
          showDescription={true}
          disabled={disabled}
        />
      </Box>
    </Modal>
  );
}

export default memo(MultiMilestoneModal);
