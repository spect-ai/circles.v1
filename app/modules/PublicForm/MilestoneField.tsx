import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Milestone } from "@/app/types";
import { Box, Button, IconPlusSmall, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import MilestoneModal from "./MilestoneModal";

type Props = {
  form: any;
  dataId?: string;
  propertyName: string;
  data: any;
  setData: (value: any) => void;
  showDescription?: boolean;
  updateRequiredFieldNotSet?: (key: string, value: any) => void;
};

export default function MilestoneField({
  form,
  propertyName,
  data,
  setData,
  showDescription,
  updateRequiredFieldNotSet,
}: Props) {
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [milestoneIndex, setMilestoneIndex] = useState<number>(0);

  return (
    <>
      <AnimatePresence>
        {isMilestoneModalOpen && (
          <MilestoneModal
            handleClose={() => {
              setIsMilestoneModalOpen(false);
            }}
            addMilestone={(value) => {
              console.log({ value });
              console.log({ data });
              if (modalMode === "create") {
                setData({
                  ...data,
                  [propertyName]: data[propertyName]
                    ? [...data[propertyName], value]
                    : [value],
                });
                updateRequiredFieldNotSet &&
                  updateRequiredFieldNotSet(
                    propertyName,
                    data[propertyName]
                      ? [...data[propertyName], value]
                      : [value]
                  );
              } else {
                data[propertyName][milestoneIndex] = value;
                setData({
                  ...data,
                });
              }

              setIsMilestoneModalOpen(false);
            }}
            modalMode={modalMode}
            milestoneIndex={milestoneIndex}
            propertyName={propertyName}
            data={data}
            form={form}
          />
        )}
      </AnimatePresence>
      <Box marginTop="4">
        <Stack direction="vertical" space="2">
          {data[propertyName]?.length &&
            data[propertyName].map((milestone: Milestone, index: number) => {
              return (
                <Box
                  key={index}
                  display="flex"
                  flexDirection="row"
                  gap="4"
                  alignItems="flex-start"
                  borderRadius="large"
                  marginBottom="4"
                  width="full"
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    width="128"
                    marginBottom="4"
                  >
                    <Text variant="extraLarge" weight="semiBold">
                      {milestone.title}
                    </Text>
                    {milestone.reward?.value && (
                      <Text variant="small" weight="light">
                        {`${milestone.reward?.value} ${milestone.reward?.token.label}`}
                      </Text>
                    )}
                    {milestone.dueDate && (
                      <Text variant="small" weight="light">
                        {`Due on ${milestone.dueDate}`}
                      </Text>
                    )}
                    {showDescription && milestone.description && (
                      <Editor value={milestone.description} disabled={true} />
                    )}
                  </Box>
                  <Box display="flex" flexDirection="row" gap="2">
                    <Button
                      variant="tertiary"
                      size="small"
                      onClick={() => {
                        setModalMode("edit");
                        setMilestoneIndex(index);
                        setIsMilestoneModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <PrimaryButton
                      onClick={() => {
                        const newMilestones = data[propertyName].filter(
                          (milestone: Milestone, i: number) => i !== index
                        );
                        setData({ ...data, [propertyName]: newMilestones });
                      }}
                    >
                      Remove
                    </PrimaryButton>
                  </Box>
                </Box>
              );
            })}
        </Stack>
        <Box width="72">
          <PrimaryButton
            variant="tertiary"
            icon={<IconPlusSmall />}
            onClick={() => setIsMilestoneModalOpen(true)}
          >
            Add new milestone
          </PrimaryButton>
        </Box>
      </Box>
    </>
  );
}
