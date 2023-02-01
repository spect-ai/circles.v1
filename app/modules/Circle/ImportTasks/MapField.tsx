import Dropdown from "@/app/common/components/Dropdown";
import Select from "@/app/common/components/Select";
import { convertToId } from "@/app/common/utils/utils";
import { MemberDetails, Option, Property, PropertyType } from "@/app/types";
import { Box, IconTrash, Stack, Text } from "degen";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "react-query";
import AddOptions from "../../Collection/AddField/AddOptions";
import { fields } from "../../Collection/Constants";

type Props = {
  propertyName: string;
  properties: {
    [key: string]: Property;
  };
  setNewProperties: (newProperties: { [key: string]: Property }) => void;
  data: any[];
  userMapping: any;
  setUserMapping: (userMapping: any) => void;
};

export default function MapField({
  propertyName,
  setNewProperties,
  properties,
  data,
  userMapping,
  setUserMapping,
}: Props) {
  const [fieldOptions, setFieldOptions] = useState(
    properties[propertyName].options || []
  );
  const router = useRouter();
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", router.query.circle],
    {
      enabled: false,
    }
  );

  let circleMembers = memberDetails?.members?.map((member: string) => ({
    label: memberDetails && memberDetails.memberDetails[member]?.username,
    value: member,
  }));

  const propertyOptions = fields.filter(
    (f) =>
      ["payWall", "reward", "milestone", "multiURL"].indexOf(f.value) === -1
  );

  return (
    <Box>
      <Stack direction="horizontal" align="center">
        <Box width="1/3">
          <Text variant="label">{properties[propertyName].name}</Text>
        </Box>
        <Box width="2/3">
          <Dropdown
            options={propertyOptions}
            selected={{
              label:
                fields.find((f) => f.value === properties[propertyName].type)
                  ?.label || "",
              value: properties[propertyName].type,
            }}
            onChange={(type) => {
              const newProperties = { ...properties };
              newProperties[properties[propertyName].name] = {
                ...properties[propertyName],
                type: type.value as PropertyType,
              };
              if (
                type.value === "singleSelect" ||
                type.value === "multiSelect" ||
                type.value === "user" ||
                type.value === "user[]"
              ) {
                // go through the json data and find all the unique values and add them to the fieldOptions, but if the value has a comma, split it and add each value to the fieldOptions
                const uniqueValues = new Set();
                data.forEach((d) => {
                  // if it has square bracktets, remove em
                  if (
                    d[properties[propertyName].name].startsWith("[") &&
                    d[properties[propertyName].name].endsWith("]")
                  ) {
                    d[properties[propertyName].name] = d[
                      properties[propertyName].name
                    ].slice(1, -1);
                  }
                  const values = (
                    d[properties[propertyName].name] as string
                  ).split(",");
                  values.forEach((v) => {
                    // trim whitespaces
                    v = v.trim();
                    uniqueValues.add(v);
                  });
                });
                const newFieldOptions: Option[] = [];
                uniqueValues.forEach((v) => {
                  newFieldOptions.push({
                    label: (v as string) || "Option 1",
                    value: convertToId(v as string),
                  });
                });
                setFieldOptions(newFieldOptions);
                newProperties[properties[propertyName].name] = {
                  ...properties[propertyName],
                  options: newFieldOptions,
                  type: type.value as PropertyType,
                };
              }
              setNewProperties(newProperties);
            }}
            multiple={false}
            isClearable={false}
          />
          {(properties[propertyName].type === "singleSelect" ||
            properties[propertyName].type === "multiSelect") && (
            <AddOptions
              fieldOptions={fieldOptions}
              setFieldOptions={setFieldOptions}
            />
          )}
          {(properties[propertyName].type === "user" ||
            properties[propertyName].type === "user[]") &&
            fieldOptions.map((option) => (
              <Stack direction="horizontal" key={option.value} align="center">
                <Text>{option.label}</Text>
                <Box width="full">
                  <Dropdown
                    options={circleMembers || []}
                    selected={{
                      label: userMapping[option.label]?.label || "",
                      value: userMapping[option.label]?.value || "",
                    }}
                    onChange={(user) => {
                      const newUserMapping = { ...userMapping };
                      newUserMapping[option.label] = {
                        label: user.label,
                        value: user.value,
                      };
                      setUserMapping(newUserMapping);
                    }}
                    multiple={false}
                    isClearable={false}
                  />
                </Box>
              </Stack>
            ))}
        </Box>
        <Box
          cursor="pointer"
          onClick={() => {
            const newProperties = { ...properties };
            delete newProperties[properties[propertyName].name];
            setNewProperties(newProperties);
          }}
        >
          <Text color="red">
            <IconTrash />
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}
