/* eslint-disable @typescript-eslint/no-explicit-any */
import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Milestone } from "@/app/types";
import { Box, Button, IconPlusSmall, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import MilestoneModal from "./MilestoneModal";

type Props = {
  form: any;
  propertyName: string;
  data: any;
  setData: (value: any) => void;
  showDescription?: boolean;
  updateRequiredFieldNotSet?: (key: string, value: any) => void;
  disabled?: boolean;
};

const MilestoneField = ({
  form,
  propertyName,
  data,
  setData,
  showDescription,
  updateRequiredFieldNotSet,
  disabled,
}: Props) => {
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
              if (modalMode === "create") {
                setData({
                  ...data,
                  [propertyName]:
                    data && data[propertyName]
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
                const newData = data[propertyName];
                newData[milestoneIndex] = value;
                setData({
                  ...newData,
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
          {data &&
            data[propertyName]?.length &&
            data[propertyName].map((milestone: Milestone, index: number) => (
              <Box
                key={milestone.id}
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
                    <Editor value={milestone.description} disabled />
                  )}
                </Box>
                {!disabled && (
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
                          (mStone: Milestone, i: number) => i !== index
                        );
                        setData({ ...data, [propertyName]: newMilestones });
                      }}
                    >
                      Remove
                    </PrimaryButton>
                  </Box>
                )}
              </Box>
            ))}
        </Stack>
        {((form.collectionType === 0 &&
          form?.properties[propertyName].isPartOfFormView) ||
          form.collectionType === 1) &&
          !disabled && (
            <Box width="full">
              <PrimaryButton
                variant="tertiary"
                icon={<IconPlusSmall />}
                onClick={() => setIsMilestoneModalOpen(true)}
              >
                Add new milestone
              </PrimaryButton>
            </Box>
          )}
      </Box>
    </>
  );
};

MilestoneField.defaultProps = {
  showDescription: false,
  updateRequiredFieldNotSet: () => {},
  disabled: false,
};

export default MilestoneField;
