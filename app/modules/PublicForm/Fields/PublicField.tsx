/* eslint-disable @typescript-eslint/no-explicit-any */
import Editor from "@/app/common/components/Editor";
import { isEmail, isURL } from "@/app/common/utils/utils";
import { FormType, Option, Property, Registry, Reward } from "@/app/types";
import { Box, Input, Stack, Tag, Text, useTheme } from "degen";
import { useState } from "react";
import { toast } from "react-toastify";
import { satisfiesConditions } from "../../Collection/Common/SatisfiesFilter";
import { DateInput } from "../../Collection/Form/Field";
import DiscordField from "./DiscordField";
import EthAddressField from "./EthAddressField";
import GithubField from "./GithubField";
import MilestoneField from "./MilestoneField";
import MultiSelect from "./MultiSelect";
import MultiURLField from "./MultiURLField";
import RewardField from "./RewardField";
import SingleSelect from "./SingleSelect";
import TelegramField from "./TelegramField";

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
  blockCustomValues?: boolean;
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
  blockCustomValues,
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
  ) {
    return null;
  }

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
          <Text weight="semiBold">{form.properties[propertyName]?.name}</Text>
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
        <Editor value={form.properties[propertyName]?.description} disabled />
      </Stack>
      {form.properties[propertyName]?.type === "shortText" && (
        <Input
          label=""
          placeholder={`Enter text`}
          value={data && data[propertyName]}
          onChange={(e) => {
            setData({ ...data, [propertyName]: e.target.value });
          }}
          onBlur={(e) => {
            updateRequiredFieldNotSet(propertyName, e.target.value);
          }}
          disabled={disabled}
        />
      )}
      {form.properties[propertyName]?.type === "email" && (
        <Input
          label=""
          placeholder={`Enter email`}
          value={data && data[propertyName]}
          inputMode="email"
          onChange={(e) => {
            setData({ ...data, [propertyName]: e.target.value });
          }}
          error={
            data && data[propertyName] && !isEmail(data[propertyName])
              ? "Invalid email"
              : undefined
          }
          onBlur={(e) => {
            updateRequiredFieldNotSet(propertyName, e.target.value);
            updateFieldHasInvalidType(propertyName, e.target.value);
          }}
          disabled={disabled}
        />
      )}
      {form.properties[propertyName]?.type === "singleURL" && (
        <Input
          label=""
          placeholder={`Enter URL`}
          value={data && data[propertyName]}
          inputMode="text"
          onChange={(e) => {
            setData({ ...data, [propertyName]: e.target.value });
          }}
          error={
            data && data[propertyName] && !isURL(data[propertyName])
              ? "Invalid URL"
              : undefined
          }
          onBlur={(e) => {
            updateRequiredFieldNotSet(propertyName, e.target.value);
            updateFieldHasInvalidType(propertyName, e.target.value);
          }}
          disabled={disabled}
        />
      )}
      {form.properties[propertyName]?.type === "multiURL" && (
        <MultiURLField
          placeholder={`Enter URL`}
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
          placeholder={`Enter number`}
          value={data && data[propertyName]?.toString()}
          type="number"
          onChange={(e) => {
            setData({ ...data, [propertyName]: parseFloat(e.target.value) });
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
          onBlur={(e) => {
            updateRequiredFieldNotSet(propertyName, e.target.value);
          }}
          disabled={disabled}
        />
      )}
      {form.properties[propertyName]?.type === "date" && (
        <DateInput
          placeholder={`Enter date`}
          type="date"
          mode={mode}
          value={data && data[propertyName]?.toString()}
          onChange={(e) => {
            setData({ ...data, [propertyName]: e.target.value });
          }}
          onBlur={(e) => {
            updateRequiredFieldNotSet(propertyName, e.target.value);
          }}
          disabled={disabled}
        />
      )}
      {form.properties[propertyName]?.type === "ethAddress" && (
        <EthAddressField
          value={data && data[propertyName]}
          disabled={disabled}
          onChange={(value) => {
            setData({ ...data, [propertyName]: value });
            updateRequiredFieldNotSet(propertyName, value);
          }}
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
            value={(data && data[propertyName]) || ""}
            onSave={(value) => {
              if (!value) return;
              data[propertyName] = value;
              setData({ ...data });
              updateRequiredFieldNotSet(propertyName, value);
            }}
            placeholder={`Enter text, use / for commands`}
            isDirty={true}
            disabled={disabled}
          />
        </Box>
      )}
      {(form.properties[propertyName]?.type === "singleSelect" ||
        form.properties[propertyName]?.type === "user") && (
        <Box marginTop="4">
          <SingleSelect
            allowCustom={
              blockCustomValues
                ? !blockCustomValues
                : form.properties[propertyName]?.allowCustom || false
            }
            options={
              form.properties[propertyName]?.type === "user"
                ? (memberOptions as any)
                : form.properties[propertyName]?.options
            }
            selected={data && data[propertyName]}
            onSelect={(value: any) => {
              if (disabled) return;
              setData({ ...data, [propertyName]: value });
            }}
            propertyName={propertyName}
            disabled={disabled}
          />
        </Box>
      )}
      {(form.properties[propertyName]?.type === "multiSelect" ||
        form.properties[propertyName]?.type === "user[]") && (
        <Box marginTop="4">
          <MultiSelect
            disabled={disabled}
            allowCustom={
              blockCustomValues
                ? !blockCustomValues
                : form.properties[propertyName]?.allowCustom || false
            }
            options={
              form.properties[propertyName]?.type === "user[]"
                ? (memberOptions as any)
                : form.properties[propertyName]?.options
            }
            selected={data && data[propertyName]}
            onSelect={(value: any) => {
              if (disabled) return;
              if (!data[propertyName]) {
                setData({ ...data, [propertyName]: [value] });
              } else {
                if (
                  data[propertyName].some(
                    (item: any) => item.value === value.value
                  )
                ) {
                  if (value.value === "__custom__" && value.label !== "") {
                    // change value of custom option
                    setData({
                      ...data,
                      [propertyName]: data[propertyName].map((item: any) => {
                        if (item.value === "__custom__") {
                          return value;
                        }
                        return item;
                      }),
                    });
                    return;
                  }
                  setData({
                    ...data,
                    [propertyName]: data[propertyName].filter(
                      (item: any) => item.value !== value.value
                    ),
                  });
                } else {
                  const maxSelections =
                    form.properties[propertyName]?.maxSelections;
                  if (maxSelections && data[propertyName]) {
                    if (data[propertyName].length >= maxSelections) {
                      toast.error(
                        `You can only select ${maxSelections} options`
                      );
                      return;
                    }
                  }
                  setData({
                    ...data,
                    [propertyName]: [...data[propertyName], value],
                  });
                }
              }
            }}
            propertyName={propertyName}
          />
        </Box>
      )}
      {form.properties[propertyName]?.type === "reward" && (
        <Box marginTop="0">
          <RewardField
            disabled={disabled}
            rewardOptions={
              form.properties[propertyName]?.rewardOptions as Registry
            }
            value={data && data[propertyName]}
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
      {form.properties[propertyName]?.type === "discord" && (
        <DiscordField
          data={data}
          setData={setData}
          propertyName={propertyName}
          updateRequiredFieldNotSet={updateRequiredFieldNotSet}
          showAvatar={true}
        />
      )}
      {form.properties[propertyName]?.type === "github" && (
        <GithubField
          data={data}
          setData={setData}
          propertyName={propertyName}
          updateRequiredFieldNotSet={updateRequiredFieldNotSet}
          showAvatar={true}
        />
      )}
      {form.properties[propertyName]?.type === "telegram" && (
        <TelegramField
          data={data}
          setData={setData}
          propertyName={propertyName}
          updateRequiredFieldNotSet={updateRequiredFieldNotSet}
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
