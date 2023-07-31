/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmail, isURL } from "@/app/common/utils/utils";
import {
  ConditionGroup,
  FormType,
  Option,
  Property,
  Registry,
  Reward,
} from "@/app/types";
import { Box, useTheme } from "degen";
import { useState } from "react";
import { toast } from "react-toastify";
import DiscordField from "./DiscordField";
import GithubField from "./GithubField";
import MultiSelect from "./MultiSelect";
import MultiURLField from "./MultiURLField";
import SingleSelect from "./SingleSelect";
import TelegramField from "./TelegramField";
import dynamic from "next/dynamic";
import styled from "@emotion/styled";
import Slider from "@/app/common/components/Slider";
import { satisfiesAdvancedConditions } from "../../Collection/Common/SatisfiesAdvancedFilter";
import { FieldContainer, InputField, SelectField, Text } from "@avp1598/vibes";
import { storeImage } from "@/app/common/utils/ipfs";

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
    !satisfiesAdvancedConditions(
      data,
      form.properties as { [propertyId: string]: Property },
      form.properties[propertyId].advancedConditions || ({} as ConditionGroup)
    )
  ) {
    return null;
  }

  return (
    <Box paddingY="2" borderRadius="large">
      <FieldContainer
        label={
          form.properties[propertyId].name === "Untitled Field"
            ? ""
            : form.properties[propertyId]?.name
        }
        description={
          form.properties[propertyId]?.description === "<p></p>"
            ? ""
            : form.properties[propertyId]?.description
        }
        required={form.properties[propertyId]?.required}
      >
        {/* <Stack direction="vertical" space="2">
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
          <Editor
            value={form.properties[propertyId].description}
            disabled
            version={form.editorVersion}
          />
        )}
      </Stack> */}
        {form.properties[propertyId]?.type === "shortText" && (
          <InputField
            placeholder={`Your answer`}
            value={data && data[propertyId]}
            onChange={(e) => {
              setData({ ...data, [propertyId]: e.target.value });
            }}
            onBlur={(e) => {
              updateRequiredFieldNotSet(propertyId, e.target.value);
            }}
            disabled={disabled}
            error={
              requiredFieldsNotSet[propertyId]
                ? "This field is required"
                : undefined
            }
          />
        )}
        {form.properties[propertyId]?.type === "email" && (
          <InputField
            placeholder={`Your answer`}
            value={data && data[propertyId]}
            inputMode="email"
            onChange={(e) => {
              setData({ ...data, [propertyId]: e.target.value });
            }}
            error={
              data && data[propertyId] && !isEmail(data[propertyId])
                ? "Invalid email"
                : requiredFieldsNotSet[propertyId]
                ? "This field is required"
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
          <InputField
            placeholder={`Your answer`}
            value={data && data[propertyId]}
            inputMode="text"
            onChange={(e) => {
              setData({ ...data, [propertyId]: e.target.value });
            }}
            error={
              data && data[propertyId] && !isURL(data[propertyId])
                ? "Invalid URL"
                : requiredFieldsNotSet[propertyId]
                ? "This field is required"
                : undefined
            }
            onBlur={(e) => {
              updateRequiredFieldNotSet(propertyId, e.target.value);
              updateFieldHasInvalidType(propertyId, e.target.value);
            }}
            disabled={disabled}
          />
        )}
        {/* {form.properties[propertyId]?.type === "multiURL" && (
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
        )} */}
        {form.properties[propertyId]?.type === "number" && (
          <InputField
            placeholder={`Your answer`}
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
            error={
              invalidNumberCharEntered[propertyId]
                ? "Invalid number"
                : requiredFieldsNotSet[propertyId]
                ? "This field is required"
                : undefined
            }
          />
        )}
        {form.properties[propertyId]?.type === "date" && (
          <InputField
            placeholder={`Your answer`}
            type="date"
            value={data && data[propertyId]?.toString()}
            onChange={(e) => {
              setData({ ...data, [propertyId]: e.target.value });
            }}
            onBlur={(e) => {
              updateRequiredFieldNotSet(propertyId, e.target.value);
            }}
            disabled={disabled}
            error={
              requiredFieldsNotSet[propertyId]
                ? "This field is required"
                : undefined
            }
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
            formError={
              requiredFieldsNotSet[propertyId]
                ? "This field is required"
                : undefined
            }
          />
        )}
        {form.properties[propertyId]?.type === "longText" && (
          // <Box
          //   marginTop="4"
          //   width="full"
          //   borderWidth="0.375"
          //   paddingX="4"
          //   paddingTop="2"
          //   paddingBottom="1"
          //   borderRadius="large"
          //   minHeight="32"
          //   maxHeight="64"
          //   overflow="auto"
          //   id="editorContainer"
          // >
          //   <Editor
          //     value={(data && data[propertyId]) || ""}
          //     onSave={(value) => {
          // if (!value) return;
          // data[propertyId] = value;
          // setData({ ...data });
          // updateRequiredFieldNotSet(propertyId, value);
          //     }}
          //     placeholder={`Enter text, use / for commands`}
          //     isDirty={true}
          //     disabled={disabled}
          //     version={form.editorVersion}
          //   />
          // </Box>
          <InputField
            placeholder={`Your answer`}
            value={data && data[propertyId]}
            onChange={(value) => {
              setData({ ...data, [propertyId]: value });
            }}
            onBlur={(value) => {
              if (!value) return;
              data[propertyId] = value;
              setData({ ...data });
              updateRequiredFieldNotSet(propertyId, value);
            }}
            fieldType="longText"
            disabled={disabled}
            uploadImage={async (file) => {
              const { imageGatewayURL } = await storeImage(file);
              return imageGatewayURL;
            }}
            error={
              requiredFieldsNotSet[propertyId]
                ? "This field is required"
                : undefined
            }
          />
        )}
        {(form.properties[propertyId]?.type === "singleSelect" ||
          form.properties[propertyId]?.type === "user") && (
          <Box marginTop="4">
            <SelectField
              allowCustomValue={
                blockCustomValues
                  ? !blockCustomValues
                  : form.properties[propertyId]?.allowCustom || false
              }
              options={
                form.properties[propertyId]?.type === "user"
                  ? (memberOptions as any)
                  : form.properties[propertyId]?.options
              }
              value={data && data[propertyId] ? data[propertyId] : {}}
              onChange={(value: any) => {
                if (disabled) return;
                setData({ ...data, [propertyId]: value });
              }}
              name={propertyId}
              isMulti={false}
              disabled={disabled}
              error={
                requiredFieldsNotSet[propertyId]
                  ? "This field is required"
                  : undefined
              }
            />
          </Box>
        )}
        {(form.properties[propertyId]?.type === "multiSelect" ||
          form.properties[propertyId]?.type === "user[]") && (
          <Box marginTop="4">
            <SelectField
              disabled={disabled}
              allowCustomValue={
                blockCustomValues
                  ? !blockCustomValues
                  : form.properties[propertyId]?.allowCustom || false
              }
              options={
                form.properties[propertyId]?.type === "user[]"
                  ? (memberOptions as any)
                  : form.properties[propertyId]?.options
              }
              value={data && data[propertyId] ? data[propertyId] : []}
              onChange={(value: any) => {
                const maxSelections =
                  form.properties[propertyId]?.maxSelections;
                if (maxSelections && value) {
                  if (value.length > maxSelections) {
                    toast.error(`You can only select ${maxSelections} options`);
                    return;
                  }
                }
                setData({ ...data, [propertyId]: value });
                // console.log({ value, data: data[propertyId] });
                // if (disabled) return;
                // if (!data[propertyId]) {
                //   console.log("here1");
                //   setData({ ...data, [propertyId]: [value] });
                // } else {
                //   console.log("here");
                //   if (
                //     data[propertyId].some(
                //       (item: any) => item.value === value.value
                //     )
                //   ) {
                //     if (value.value === "__custom__" && value.label !== "") {
                //       // change value of custom option
                //       setData({
                //         ...data,
                //         [propertyId]: data[propertyId].map((item: any) => {
                //           if (item.value === "__custom__") {
                //             return value;
                //           }
                //           return item;
                //         }),
                //       });
                //       return;
                //     }
                //     setData({
                //       ...data,
                //       [propertyId]: data[propertyId].filter(
                //         (item: any) => item.value !== value.value
                //       ),
                //     });
                //   } else {
                // const maxSelections =
                //   form.properties[propertyId]?.maxSelections;
                // if (maxSelections && data[propertyId]) {
                //   if (data[propertyId].length >= maxSelections) {
                //     toast.error(
                //       `You can only select ${maxSelections} options`
                //     );
                //     return;
                //   }
                // }
                //     setData({
                //       ...data,
                //       [propertyId]: [...data[propertyId], value],
                //     });
                //   }
                // }
              }}
              name={propertyId}
              isMulti={true}
              error={
                requiredFieldsNotSet[propertyId]
                  ? "This field is required"
                  : undefined
              }
            />
          </Box>
        )}
        {form.properties[propertyId]?.type === "slider" && (
          <Slider
            label=""
            min={form.properties[propertyId]?.sliderOptions?.min || 1}
            max={form.properties[propertyId]?.sliderOptions?.max || 10}
            value={data && data[propertyId]}
            minLabel={form.properties[propertyId]?.sliderOptions?.minLabel}
            maxLabel={form.properties[propertyId]?.sliderOptions?.maxLabel}
            onChange={(value: any) => {
              setData({ ...data, [propertyId]: value });
            }}
            disabled={disabled}
            error={
              requiredFieldsNotSet[propertyId]
                ? "This field is required"
                : undefined
            }
          />
        )}
        {form.properties[propertyId]?.type === "reward" && (
          <Box marginTop="0" width="full">
            <RewardField
              propertyId={propertyId}
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
              error={
                requiredFieldsNotSet[propertyId]
                  ? "This field is required"
                  : invalidNumberCharEntered[propertyId]
                  ? "Please enter a valid number"
                  : undefined
              }
            />
          </Box>
        )}
        {/* {form.properties[propertyId]?.type === "milestone" && (
          <MilestoneField
            form={form as any}
            data={data}
            setData={setData}
            propertyId={propertyId}
            updateRequiredFieldNotSet={updateRequiredFieldNotSet}
            disabled={disabled}
          />
        )} */}
        {form.properties[propertyId]?.type === "discord" && (
          <DiscordField
            data={data}
            setData={setData}
            propertyId={propertyId}
            updateRequiredFieldNotSet={updateRequiredFieldNotSet}
            showAvatar={true}
            error={
              requiredFieldsNotSet[propertyId]
                ? "This field is required"
                : undefined
            }
          />
        )}
        {form.properties[propertyId]?.type === "github" && (
          <GithubField
            data={data}
            setData={setData}
            propertyId={propertyId}
            updateRequiredFieldNotSet={updateRequiredFieldNotSet}
            showAvatar={true}
            error={
              requiredFieldsNotSet[propertyId]
                ? "This field is required"
                : undefined
            }
          />
        )}
        {form.properties[propertyId]?.type === "telegram" && (
          <TelegramField
            data={data}
            setData={setData}
            propertyId={propertyId}
            updateRequiredFieldNotSet={updateRequiredFieldNotSet}
            error={
              requiredFieldsNotSet[propertyId]
                ? "This field is required"
                : undefined
            }
          />
        )}

        {invalidNumberCharEntered[propertyId] && (
          <Text type="label">Please enter a number</Text>
        )}
      </FieldContainer>
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
