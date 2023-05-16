/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmail, isURL } from "@/app/common/utils/utils";
import { FormType, Option, Property, Registry, Reward } from "@/app/types";
import { Box, Input, Stack, Tag, Text, useTheme } from "degen";
import { useState } from "react";
import { toast } from "react-toastify";
import { satisfiesConditions } from "../../Collection/Common/SatisfiesFilter";
import DiscordField from "./DiscordField";
import GithubField from "./GithubField";
import MultiSelect from "./MultiSelect";
import MultiURLField from "./MultiURLField";
import SingleSelect from "./SingleSelect";
import TelegramField from "./TelegramField";
import dynamic from "next/dynamic";
import styled from "@emotion/styled";
import Slider from "@/app/common/components/Slider";

const Editor = dynamic(() => import("@/app/common/components/Editor"), {
  ssr: false,
});

const RewardField = dynamic(() => import("./RewardField"));
const MilestoneField = dynamic(() => import("./MilestoneField"));
const EthAddressField = dynamic(() => import("./EthAddressField"));

type Props = {
  form: FormType;
  propertyId: string;
  data: any;
  setData: (value: any) => void;
  memberOptions: Option[];
  requiredFieldsNotSet: { [key: string]: boolean };
  updateRequiredFieldNotSet: (key: string, value: any) => void;
  fieldHasInvalidType: { [key: string]: boolean };
  updateFieldHasInvalidType: (key: string, value: any) => void;
  disabled: boolean;
  blockCustomValues?: boolean;
  hideDescription?: boolean;
};

export default function PublicField({
  form,
  propertyId,
  data,
  setData,
  memberOptions,
  requiredFieldsNotSet,
  updateRequiredFieldNotSet,
  fieldHasInvalidType,
  updateFieldHasInvalidType,
  disabled,
  blockCustomValues,
  hideDescription = false,
}: Props) {
  const { mode } = useTheme();

  const [invalidNumberCharEntered, setInvalidNumberCharEntered] = useState(
    {} as { [key: string]: boolean }
  );
  if (
    !satisfiesConditions(
      data,
      form.properties as { [propertyId: string]: Property },
      form.properties[propertyId].viewConditions || []
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
          <Text weight="semiBold">{form.properties[propertyId]?.name}</Text>
          {form.properties[propertyId].required && (
            <Tag size="small" tone="accent">
              Required
            </Tag>
          )}
          {form.properties[propertyId].immutable && (
            <Tag size="small" tone="blue">
              Immutable
            </Tag>
          )}
        </Box>
        {requiredFieldsNotSet[propertyId] && (
          <Text color="red" variant="small">
            This is a required field and cannot be empty
          </Text>
        )}
        {fieldHasInvalidType[propertyId] && (
          <Text color="red" variant="small">
            {`This field is of type ${form.properties[propertyId].type}`}
          </Text>
        )}
        {form.properties[propertyId]?.description && !hideDescription && (
          <Editor value={form.properties[propertyId].description} disabled />
        )}
      </Stack>
      {form.properties[propertyId]?.type === "shortText" && (
        <Input
          label=""
          placeholder={`Enter text`}
          value={data && data[propertyId]}
          onChange={(e) => {
            setData({ ...data, [propertyId]: e.target.value });
          }}
          onBlur={(e) => {
            updateRequiredFieldNotSet(propertyId, e.target.value);
          }}
          disabled={disabled}
        />
      )}
      {form.properties[propertyId]?.type === "email" && (
        <Input
          label=""
          placeholder={`Enter email`}
          value={data && data[propertyId]}
          inputMode="email"
          onChange={(e) => {
            setData({ ...data, [propertyId]: e.target.value });
          }}
          error={
            data && data[propertyId] && !isEmail(data[propertyId])
              ? "Invalid email"
              : undefined
          }
          onBlur={(e) => {
            updateRequiredFieldNotSet(propertyId, e.target.value);
            updateFieldHasInvalidType(propertyId, e.target.value);
          }}
          disabled={disabled}
        />
      )}
      {form.properties[propertyId]?.type === "singleURL" && (
        <Input
          label=""
          placeholder={`Enter URL`}
          value={data && data[propertyId]}
          inputMode="text"
          onChange={(e) => {
            setData({ ...data, [propertyId]: e.target.value });
          }}
          error={
            data && data[propertyId] && !isURL(data[propertyId])
              ? "Invalid URL"
              : undefined
          }
          onBlur={(e) => {
            updateRequiredFieldNotSet(propertyId, e.target.value);
            updateFieldHasInvalidType(propertyId, e.target.value);
          }}
          disabled={disabled}
        />
      )}
      {form.properties[propertyId]?.type === "multiURL" && (
        <MultiURLField
          placeholder={`Enter URL`}
          value={data && data[propertyId]}
          disabled={disabled}
          updateFieldHasInvalidType={updateFieldHasInvalidType}
          updateRequiredFieldNotSet={updateRequiredFieldNotSet}
          data={data}
          setData={setData}
          propertyId={propertyId}
        />
      )}
      {form.properties[propertyId]?.type === "number" && (
        <Input
          label=""
          placeholder={`Enter number`}
          value={data && data[propertyId]?.toString()}
          type="number"
          onChange={(e) => {
            setData({ ...data, [propertyId]: parseFloat(e.target.value) });
          }}
          onKeyDown={(e) => {
            if (
              isNaN(e.key as any) &&
              data[propertyId] &&
              isNaN(data[propertyId])
            ) {
              setInvalidNumberCharEntered({
                ...invalidNumberCharEntered,
                [propertyId]: true,
              });
            } else {
              setInvalidNumberCharEntered({
                ...invalidNumberCharEntered,
                [propertyId]: false,
              });
            }
          }}
          onBlur={(e) => {
            updateRequiredFieldNotSet(propertyId, e.target.value);
          }}
          disabled={disabled}
        />
      )}
      {form.properties[propertyId]?.type === "date" && (
        <DateInput
          placeholder={`Enter date`}
          type="date"
          mode={mode}
          value={data && data[propertyId]?.toString()}
          onChange={(e) => {
            setData({ ...data, [propertyId]: e.target.value });
          }}
          onBlur={(e) => {
            updateRequiredFieldNotSet(propertyId, e.target.value);
          }}
          disabled={disabled}
        />
      )}
      {form.properties[propertyId]?.type === "ethAddress" && (
        <EthAddressField
          value={data && data[propertyId]}
          disabled={disabled}
          onChange={(value) => {
            setData({ ...data, [propertyId]: value });
            updateRequiredFieldNotSet(propertyId, value);
          }}
        />
      )}
      {form.properties[propertyId]?.type === "longText" && (
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
            value={(data && data[propertyId]) || ""}
            onSave={(value) => {
              if (!value) return;
              data[propertyId] = value;
              setData({ ...data });
              updateRequiredFieldNotSet(propertyId, value);
            }}
            placeholder={`Enter text, use / for commands`}
            isDirty={true}
            disabled={disabled}
          />
        </Box>
      )}
      {(form.properties[propertyId]?.type === "singleSelect" ||
        form.properties[propertyId]?.type === "user") && (
        <Box marginTop="4">
          <SingleSelect
            allowCustom={
              blockCustomValues
                ? !blockCustomValues
                : form.properties[propertyId]?.allowCustom || false
            }
            options={
              form.properties[propertyId]?.type === "user"
                ? (memberOptions as any)
                : form.properties[propertyId]?.options
            }
            selected={data && data[propertyId]}
            onSelect={(value: any) => {
              if (disabled) return;
              setData({ ...data, [propertyId]: value });
            }}
            propertyId={propertyId}
            disabled={disabled}
          />
        </Box>
      )}
      {(form.properties[propertyId]?.type === "multiSelect" ||
        form.properties[propertyId]?.type === "user[]") && (
        <Box marginTop="4">
          <MultiSelect
            disabled={disabled}
            allowCustom={
              blockCustomValues
                ? !blockCustomValues
                : form.properties[propertyId]?.allowCustom || false
            }
            options={
              form.properties[propertyId]?.type === "user[]"
                ? (memberOptions as any)
                : form.properties[propertyId]?.options
            }
            selected={data && data[propertyId]}
            onSelect={(value: any) => {
              if (disabled) return;
              if (!data[propertyId]) {
                setData({ ...data, [propertyId]: [value] });
              } else {
                if (
                  data[propertyId].some(
                    (item: any) => item.value === value.value
                  )
                ) {
                  if (value.value === "__custom__" && value.label !== "") {
                    // change value of custom option
                    setData({
                      ...data,
                      [propertyId]: data[propertyId].map((item: any) => {
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
                    [propertyId]: data[propertyId].filter(
                      (item: any) => item.value !== value.value
                    ),
                  });
                } else {
                  const maxSelections =
                    form.properties[propertyId]?.maxSelections;
                  if (maxSelections && data[propertyId]) {
                    if (data[propertyId].length >= maxSelections) {
                      toast.error(
                        `You can only select ${maxSelections} options`
                      );
                      return;
                    }
                  }
                  setData({
                    ...data,
                    [propertyId]: [...data[propertyId], value],
                  });
                }
              }
            }}
            propertyId={propertyId}
          />
        </Box>
      )}
      {form.properties[propertyId]?.type === "slider" && (
        <Slider
          label=""
          min={form.properties[propertyId]?.sliderOptions?.min || 1}
          max={form.properties[propertyId]?.sliderOptions?.max || 10}
          step={form.properties[propertyId]?.sliderOptions?.step || 1}
          value={data && data[propertyId]}
          onChange={(value: number | number[]) => {
            setData({ ...data, [propertyId]: value });
          }}
          disabled={disabled}
        />
      )}
      {form.properties[propertyId]?.type === "reward" && (
        <Box marginTop="0">
          <RewardField
            disabled={disabled}
            rewardOptions={
              form.properties[propertyId]?.rewardOptions as Registry
            }
            value={data && data[propertyId]}
            updateData={(reward: Reward) => {
              setData({
                ...data,
                [propertyId]: reward,
              });
              updateRequiredFieldNotSet(propertyId, reward);
            }}
            onValueKeyDown={(e: any) => {
              if (isNaN(e.key)) {
                setInvalidNumberCharEntered({
                  ...invalidNumberCharEntered,
                  [propertyId]: true,
                });
              } else {
                setInvalidNumberCharEntered({
                  ...invalidNumberCharEntered,
                  [propertyId]: false,
                });
              }
            }}
          />
        </Box>
      )}
      {form.properties[propertyId]?.type === "milestone" && (
        <MilestoneField
          form={form}
          data={data}
          setData={setData}
          propertyId={propertyId}
          updateRequiredFieldNotSet={updateRequiredFieldNotSet}
          disabled={disabled}
        />
      )}
      {form.properties[propertyId]?.type === "discord" && (
        <DiscordField
          data={data}
          setData={setData}
          propertyId={propertyId}
          updateRequiredFieldNotSet={updateRequiredFieldNotSet}
          showAvatar={true}
        />
      )}
      {form.properties[propertyId]?.type === "github" && (
        <GithubField
          data={data}
          setData={setData}
          propertyId={propertyId}
          updateRequiredFieldNotSet={updateRequiredFieldNotSet}
          showAvatar={true}
        />
      )}
      {form.properties[propertyId]?.type === "telegram" && (
        <TelegramField
          data={data}
          setData={setData}
          propertyId={propertyId}
          updateRequiredFieldNotSet={updateRequiredFieldNotSet}
        />
      )}

      {invalidNumberCharEntered[propertyId] && (
        <Text variant="label" size="small">
          Please enter a number{" "}
        </Text>
      )}
    </Box>
  );
}

const DateInput = styled.input<{ mode: string }>`
  padding: 1rem;
  border-radius: 0.55rem;
  border 1px solid ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255,0.1)" : "rgb(20,20,20,0.1)"};
  background-color: ${(props) =>
    props.mode === "dark" ? "rgb(20,20,20)" : "rgb(255, 255, 255)"};
  width: 100%;
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255,0.7)" : "rgb(20,20,20,0.7)"};
  margin-top: 10px;
  outline: none;
  &:focus {
    border-color: rgb(191, 90, 242, 1);
  }
  transition: border-color 0.5s ease;
`;
