/* eslint-disable @typescript-eslint/no-explicit-any */
import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { CollectionType, Milestone } from "@/app/types";
import { Box, Button, IconPlusSmall, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import MilestoneModal from "./MilestoneModal";

type Props = {
  form: CollectionType;
  dataId?: string;
  propertyId: string;
  data: any;
  setData: (value: any) => void;
  showDescription?: boolean;
  updateRequiredFieldNotSet?: (key: string, value: any) => void;
  disabled?: boolean;
};

export default function MilestoneField({
  form,
  propertyId,
  data,
  setData,
  showDescription,
  updateRequiredFieldNotSet,
  disabled,
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
              if (modalMode === "create") {
                setData({
                  ...data,
                  [propertyId]:
                    data && data[propertyId]
                      ? [...data[propertyId], value]
                      : [value],
                });
                updateRequiredFieldNotSet &&
                  updateRequiredFieldNotSet(
                    propertyId,
                    data[propertyId] ? [...data[propertyId], value] : [value]
                  );
              } else {
                data[propertyId][milestoneIndex] = value;
                setData({
                  ...data,
                });
              }

              setIsMilestoneModalOpen(false);
            }}
            modalMode={modalMode}
            milestoneIndex={milestoneIndex}
            propertyId={propertyId}
            data={data}
            form={form}
          />
        )}
      </AnimatePresence>
      <Box marginTop="4">
        <Stack direction="vertical" space="2">
          {data &&
            data[propertyId]?.length &&
            data[propertyId].map((milestone: Milestone, index: number) => {
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
                      <Editor
                        value={milestone.description}
                        disabled={true}
                        version={form.editorVersion}
                      />
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
                          const newMilestones = data[propertyId].filter(
                            (milestone: Milestone, i: number) => i !== index
                          );
                          setData({ ...data, [propertyId]: newMilestones });
                        }}
                      >
                        Remove
                      </PrimaryButton>
                    </Box>
                  )}
                </Box>
              );
            })}
        </Stack>
        {((form.collectionType === 0 &&
          form?.properties[propertyId].isPartOfFormView) ||
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
}
