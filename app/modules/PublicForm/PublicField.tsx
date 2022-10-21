import Dropdown from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import { validateEmail } from "@/app/common/utils/utils";
import { FormType, Option } from "@/app/types";
import { Box, Input, Stack, Tag, Text, useTheme } from "degen";
import { DateInput } from "../Collection/Form/Field";
import MilestoneField from "./MilestoneField";
import RewardField from "./RewardField";

type Props = {
  form: FormType;
  propertyName: string;
  data: any;
  setData: (value: any) => void;
  memberOptions: Option[];
  requiredFieldsNotSet: { [key: string]: boolean };
  updateRequiredFieldNotSet: (key: string, value: any) => void;
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
  return (
    <Box
      padding="4"
      margin="1"
      borderRadius="large"
      //   mode={mode}
    >
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
            updateRequiredFieldNotSet(propertyName, e.target.value);
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
            updateRequiredFieldNotSet(propertyName, e.target.value);
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
              updateRequiredFieldNotSet(propertyName, value);
            }}
            portal={false}
          />
        </Box>
      )}
      {form.properties[propertyName]?.type === "reward" && (
        <Box marginTop="4">
          <RewardField
            form={form}
            data={data}
            setData={setData}
            propertyName={propertyName}
            updateData={(key, value) => {
              setData({
                ...data,
                [propertyName]: {
                  ...data[propertyName],
                  [key]: value,
                },
              });
              updateRequiredFieldNotSet(propertyName, value);
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
        />
      )}
    </Box>
  );
}
