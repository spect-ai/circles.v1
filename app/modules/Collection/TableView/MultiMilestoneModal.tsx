import Modal from "@/app/common/components/Modal";
import { Milestone } from "@/app/types";
import { Box } from "degen";
import { memo, useEffect, useState } from "react";
import MilestoneField from "../../PublicForm/MilestoneField";
import { useLocalCollection } from "../Context/LocalCollectionContext";

type Props = {
  form: any;
  dataId: string;
  propertyName: string;
  handleClose: (
    value: Milestone[],
    dataId: string,
    propertyName: string
  ) => void;
};

function MultiMilestoneModal({
  propertyName,
  dataId,
  form,
  handleClose,
}: Props) {
  console;
  const [value, setValue] = useState(form.data[dataId]);

  return (
    <Modal
      handleClose={() => {
        handleClose(value[propertyName], dataId, propertyName);
      }}
      title="Edit Milestones"
    >
      <Box
        padding="8"
        width="full"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        gap="4"
      >
        {dataId && (
          <MilestoneField
            form={form}
            dataId={dataId}
            propertyName={propertyName}
            data={value}
            setData={setValue}
            showDescription={true}
          />
        )}
      </Box>
    </Modal>
  );
}

export default memo(MultiMilestoneModal);
