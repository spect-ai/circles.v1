import Dropdown from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { validateEmail } from "@/app/common/utils/utils";
import { FormType, Milestone, Option, Registry } from "@/app/types";
import { useEffect } from "@storybook/addons";
import {
  Box,
  Button,
  IconEth,
  IconPlusSmall,
  Input,
  Stack,
  Tag,
  Text,
  useTheme,
} from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { DateInput } from "../Collection/Form/Field";
import RewardModal from "../Collection/TableView/RewardModal";
import MilestoneModal from "./MilestoneModal";
import RewardField from "./RewardField";

type Props = {
  form: FormType;
  propertyName: string;
  data: any;
  setData: (value: any) => void;
  memberOptions: Option[];
  requiredFieldsNotSet: { [key: string]: boolean };
  updateRequiredFieldNotSet: (key: string, value: string) => void;
};

export default function PublicField({
  form,
  propertyName,
  data,
  setData,
  memberOptions,
  requiredFieldsNotSet,
  updateRequiredFieldNotSet,
}: Props) {
  const { mode } = useTheme();
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);

  console.log({ data });
  return (
    <Box
      padding="4"
      margin="1"
      borderRadius="large"
      //   mode={mode}
    >
      <AnimatePresence>
        {isMilestoneModalOpen && (
          <MilestoneModal
            handleClose={() => {
              setIsMilestoneModalOpen(false);
            }}
            addMilestone={(value, dataId, propertyName) => {
              setData({
                ...data,
                [propertyName]: [data[propertyName] || [], value],
              });
              setIsMilestoneModalOpen(false);
            }}
            propertyName={propertyName}
            form={form}
          />
        )}
      </AnimatePresence>
      <Stack direction="vertical" space="2">
        <Box
          width="full"
          display="flex"
          flexDirection="row"
          gap="2"
          alignItems="center"
        >
          <Text variant="label">{form.properties[propertyName]?.name}</Text>
          {form.properties[propertyName].required && (
            <Tag size="small" tone="accent">
              Required
            </Tag>
          )}
        </Box>
        {requiredFieldsNotSet[propertyName] && (
          <Text color="red" variant="small">
            This is a required field and cannot be empty
          </Text>
        )}
      </Stack>
      {form.properties[propertyName]?.type === "shortText" && (
        <Input
          label=""
          placeholder={`Enter ${form.properties[propertyName]?.name}`}
          value={data && data[propertyName]}
          onChange={(e) => {
            setData({ ...data, [propertyName]: e.target.value });
            updateRequiredFieldNotSet(propertyName, e.target.value);
          }}
        />
      )}
      {form.properties[propertyName]?.type === "email" && (
        <Input
          label=""
          placeholder={`Enter ${form.properties[propertyName]?.name}`}
          value={data && data[propertyName]}
          inputMode="email"
          onChange={(e) => {
            setData({ ...data, [propertyName]: e.target.value });
            updateRequiredFieldNotSet(propertyName, e.target.value);
          }}
          error={
            data && data[propertyName] && !validateEmail(data[propertyName])
          }
        />
      )}
      {form.properties[propertyName]?.type === "number" && (
        <Input
          label=""
          placeholder={`Enter ${form.properties[propertyName]?.name}`}
          value={data && data[propertyName]}
          type="number"
          onChange={(e) => {
            setData({ ...data, [propertyName]: e.target.value });
            updateRequiredFieldNotSet(propertyName, e.target.value);
          }}
        />
      )}
      {form.properties[propertyName]?.type === "date" && (
        <DateInput
          placeholder={`Enter ${form.properties[propertyName]?.name}`}
          value={data && data[propertyName]}
          type="date"
          mode={mode}
          onChange={(e) => {
            setData({ ...data, [propertyName]: e.target.value });
          }}
        />
      )}
      {form.properties[propertyName]?.type === "ethAddress" && (
        <Input
          label=""
          placeholder={`Enter ${form.properties[propertyName]?.name}`}
          value={data && data[propertyName]}
          onChange={(e) => {
            setData({ ...data, [propertyName]: e.target.value });
          }}
        />
      )}
      {form.properties[propertyName]?.type === "longText" && (
        <Box
          marginTop="4"
          width="full"
          borderWidth="0.375"
          padding="4"
          borderRadius="large"
          maxHeight="64"
          overflow="auto"
        >
          <Editor
            value={data[propertyName]}
            onSave={(value) => {
              console.log({ value });
              data[propertyName] = value;
              setData({ ...data });
              updateRequiredFieldNotSet(propertyName, value);
            }}
            placeholder={`Type here to edit ${propertyName}`}
            isDirty={true}
          />
        </Box>
      )}
      {(form.properties[propertyName]?.type === "singleSelect" ||
        form.properties[propertyName]?.type === "user" ||
        form.properties[propertyName]?.type === "multiSelect" ||
        form.properties[propertyName]?.type === "user[]") && (
        <Box marginTop="4">
          <Dropdown
            placeholder={`Select ${form.properties[propertyName]?.name}`}
            multiple={
              form.properties[propertyName]?.type === "multiSelect" ||
              form.properties[propertyName]?.type === "user[]"
            }
            options={
              form.properties[propertyName]?.type === "user" ||
              form.properties[propertyName]?.type === "user[]"
                ? (memberOptions as any)
                : form.properties[propertyName]?.options
            }
            selected={data && data[propertyName]}
            onChange={(value: any) => {
              setData({ ...data, [propertyName]: value });
            }}
            portal={false}
          />
        </Box>
      )}
      {form.properties[propertyName]?.type === "reward" && (
        <Box marginTop="4">
          {/* <ClickableTag
            name={
              data[propertyName] && data[propertyName].value
                ? `${data[propertyName].value} ${data[propertyName].token.symbol} on ${data[propertyName].chain.name}`
                : `Add Reward`
            }
            icon={<IconEth color="accent" size="5" />}
            onClick={() => {
              setIsRewardModalOpen(true);
            }}
          /> */}
          <RewardField
            form={form}
            data={data}
            setData={setData}
            propertyName={propertyName}
          />
        </Box>
      )}
      {form.properties[propertyName]?.type === "milestone" && (
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
                          {`${milestone.reward?.value} ${milestone.reward?.token.name}`}
                        </Text>
                      )}
                      {milestone.dueDate && (
                        <Text variant="small" weight="light">
                          {`Due on ${milestone.dueDate}`}
                        </Text>
                      )}
                    </Box>
                    <Box display="flex" flexDirection="row" gap="2">
                      <Button
                        variant="tertiary"
                        size="small"
                        onClick={() => {}}
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
      )}
    </Box>
  );
}
