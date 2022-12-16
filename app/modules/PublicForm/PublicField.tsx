/* eslint-disable @typescript-eslint/no-explicit-any */
import Dropdown from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import { isEmail, isURL } from "@/app/common/utils/utils";
import { FormType, Option, Property, Registry, Reward } from "@/app/types";
import { Box, Input, Stack, Tag, Text, useTheme } from "degen";
import { ethers } from "ethers";
import { useState } from "react";
import { satisfiesConditions } from "../Collection/Common/SatisfiesFilter";
import { DateInput } from "../Collection/Form/Field";
import MilestoneField from "./MilestoneField";
import MultiURLField from "./MultiURLField";
import RewardField from "./RewardField";

type Props = {
  form: FormType;
  propertyName: string;
  data: any;
  setData: (value: any) => void;
  memberOptions: Option[];
  requiredFieldsNotSet: { [key: string]: boolean };
  updateRequiredFieldNotSet: (key: string, value: any) => void;
  fieldHasInvalidType: { [key: string]: boolean };
  updateFieldHasInvalidType: (key: string, value: any) => void;
  disabled: boolean;
};

export default function PublicField({
  form,
  propertyName,
  data,
  setData,
  memberOptions,
  requiredFieldsNotSet,
  updateRequiredFieldNotSet,
  fieldHasInvalidType,
  updateFieldHasInvalidType,
  disabled,
}: Props) {
  const { mode } = useTheme();
  const [invalidNumberCharEntered, setInvalidNumberCharEntered] = useState(
    {} as { [key: string]: boolean }
  );

  if (
    !satisfiesConditions(
      data,
      form.properties as { [propertyId: string]: Property },
      form.properties[propertyName].viewConditions || []
    )
  )
    return null;

  return (
    <Box paddingY="4" borderRadius="large">
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
        {fieldHasInvalidType[propertyName] && (
          <Text color="red" variant="small">
            {`This field is of type ${form.properties[propertyName].type}`}
          </Text>
        )}
        <Text variant="small">
          {form.properties[propertyName]?.description}
        </Text>
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
          disabled={disabled}
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
            updateFieldHasInvalidType(propertyName, e.target.value);
          }}
          error={
            data && data[propertyName] && !isEmail(data[propertyName])
              ? "Invalid email"
              : undefined
          }
          disabled={disabled}
        />
      )}
      {form.properties[propertyName]?.type === "singleURL" && (
        <Input
          label=""
          placeholder={`Enter ${form.properties[propertyName]?.name}`}
          value={data && data[propertyName]}
          inputMode="text"
          onChange={(e) => {
            setData({ ...data, [propertyName]: e.target.value });
            updateRequiredFieldNotSet(propertyName, e.target.value);
            updateFieldHasInvalidType(propertyName, e.target.value);
          }}
          error={
            data && data[propertyName] && !isURL(data[propertyName])
              ? "Invalid URL"
              : undefined
          }
          disabled={disabled}
        />
      )}
      {form.properties[propertyName]?.type === "multiURL" && (
        <MultiURLField
          placeholder={`Enter ${form.properties[propertyName]?.name}`}
          value={data && data[propertyName]}
          disabled={disabled}
          updateFieldHasInvalidType={updateFieldHasInvalidType}
          updateRequiredFieldNotSet={updateRequiredFieldNotSet}
          data={data}
          setData={setData}
          propertyName={propertyName}
        />
      )}
      {form.properties[propertyName]?.type === "number" && (
        <Input
          label=""
          placeholder={`Enter ${form.properties[propertyName]?.name}`}
          value={data && data[propertyName]?.toString()}
          type="number"
          onChange={(e) => {
            setData({ ...data, [propertyName]: parseFloat(e.target.value) });
            updateRequiredFieldNotSet(propertyName, e.target.value);
          }}
          onKeyDown={(e) => {
            if (
              isNaN(e.key as any) &&
              data[propertyName] &&
              isNaN(data[propertyName])
            ) {
              setInvalidNumberCharEntered({
                ...invalidNumberCharEntered,
                [propertyName]: true,
              });
            } else {
              setInvalidNumberCharEntered({
                ...invalidNumberCharEntered,
                [propertyName]: false,
              });
            }
          }}
          disabled={disabled}
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
            updateRequiredFieldNotSet(propertyName, e.target.value);
          }}
          disabled={disabled}
        />
      )}
      {form.properties[propertyName]?.type === "ethAddress" && (
        <Input
          label=""
          placeholder={`Enter ${form.properties[propertyName]?.name}`}
          value={data && data[propertyName]}
          onChange={(e) => {
            setData({ ...data, [propertyName]: e.target.value });
            updateRequiredFieldNotSet(propertyName, e.target.value);
            updateFieldHasInvalidType(propertyName, e.target.value);
          }}
          disabled={disabled}
          error={
            data &&
            data[propertyName] &&
            !ethers.utils.isAddress(data[propertyName])
              ? "Invalid address"
              : undefined
          }
        />
      )}
      {form.properties[propertyName]?.type === "longText" && (
        <Box
          marginTop="4"
          width="full"
          borderWidth="0.375"
          paddingX="4"
          paddingTop="2"
          paddingBottom="1"
          borderRadius="large"
          minHeight="32"
          maxHeight="64"
          overflow="auto"
          id="editorContainer"
        >
          <Editor
            value={data[propertyName]}
            onSave={(value) => {
              data[propertyName] = value;
              setData({ ...data });
              updateRequiredFieldNotSet(propertyName, value);
            }}
            placeholder={`Type here to edit ${propertyName}`}
            isDirty={true}
            disabled={disabled}
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
              updateRequiredFieldNotSet(propertyName, value);
            }}
            portal
            disabled={disabled}
          />
        </Box>
      )}
      {form.properties[propertyName]?.type === "reward" && (
        <Box marginTop="4">
          <RewardField
            disabled={disabled}
            rewardOptions={
              form.properties[propertyName]?.rewardOptions as Registry
            }
            data={data}
            propertyName={propertyName}
            updateData={(reward: Reward) => {
              setData({
                ...data,
                [propertyName]: reward,
              });
              updateRequiredFieldNotSet(propertyName, reward);
            }}
            onValueKeyDown={(e: any) => {
              if (isNaN(e.key)) {
                setInvalidNumberCharEntered({
                  ...invalidNumberCharEntered,
                  [propertyName]: true,
                });
              } else {
                setInvalidNumberCharEntered({
                  ...invalidNumberCharEntered,
                  [propertyName]: false,
                });
              }
            }}
          />
        </Box>
      )}
      {form.properties[propertyName]?.type === "milestone" && (
        <MilestoneField
          form={form}
          data={data}
          setData={setData}
          propertyName={propertyName}
          updateRequiredFieldNotSet={updateRequiredFieldNotSet}
          disabled={disabled}
        />
      )}

      {invalidNumberCharEntered[propertyName] && (
        <Text variant="label" size="small">
          Please enter a number{" "}
        </Text>
      )}
    </Box>
  );
}
