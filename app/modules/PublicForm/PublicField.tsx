import Dropdown from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { FormType, Option } from "@/app/types";
import { Box, IconEth, IconPlusSmall, Input, Tag, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { DateInput } from "../Collection/Form/Field";
import RewardModal from "../Collection/TableView/RewardModal";
import AddMilestone from "./MilestoneModal";

type Props = {
  form: FormType;
  propertyName: string;
  data: any;
  setData: (value: any) => void;
  memberOptions: Option[];
};

export default function PublicField({
  form,
  propertyName,
  data,
  setData,
  memberOptions,
}: Props) {
  const { mode } = useTheme();
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  return (
    <Box
      padding="4"
      margin="1"
      borderRadius="large"
      //   mode={mode}
    >
      <AnimatePresence>
        {isRewardModalOpen && (
          <RewardModal
            handleClose={(value) => {
              setData({ ...data, [propertyName]: value });
              setIsRewardModalOpen(false);
            }}
            propertyName={propertyName}
            form={form}
          />
        )}
      </AnimatePresence>
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
      {form.properties[propertyName]?.type === "shortText" && (
        <Input
          label=""
          placeholder={`Enter ${form.properties[propertyName]?.name}`}
          value={data && data[propertyName]}
          onChange={(e) => {
            setData({ ...data, [propertyName]: e.target.value });
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
          }}
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
          <ClickableTag
            name={
              data[propertyName] && data[propertyName].value
                ? `${data[propertyName].value} ${data[propertyName].token.symbol} on ${data[propertyName].chain.name}`
                : `Add Reward`
            }
            icon={<IconEth color="accent" size="5" />}
            onClick={() => {
              setIsRewardModalOpen(true);
            }}
          />
        </Box>
      )}
      {form.properties[propertyName]?.type === "milestone" && <AddMilestone />}
    </Box>
  );
}
