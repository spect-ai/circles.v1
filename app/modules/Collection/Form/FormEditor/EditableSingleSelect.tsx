import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Option } from "@/app/types";
import { Box, Input, Stack, Text } from "degen";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { v4 as uuid } from "uuid";
import { updateField } from "@/app/services/Collection";
import { logError } from "@/app/common/utils/utils";

type Props = {
  options: Option[];
  selected: Option;
  propertyId: string;
  disabled?: boolean;
};

const EditableSingleSelect = ({ options, selected, propertyId }: Props) => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const [allowCustom, setAllowCustom] = useState(false);

  useEffect(() => {
    if (allowCustom && !options.some((o) => o.value === "__custom__")) {
      options.push({ label: "Other", value: "__custom__" });
    }
  }, []);

  const inputRef: any = useRef();

  return (
    <Box>
      <Stack>
        {options.map((option) => (
          <Stack
            key={option.value}
            direction="horizontal"
            align="center"
            space="2"
          >
            <input
              name={propertyId}
              type="radio"
              value={option.value}
              checked={selected?.value === option.value}
              style={{
                width: "20px",
                height: "20px",
                cursor: "pointer",
              }}
            />
            <NameInput
              defaultValue={option.label}
              onBlur={async (e) => {
                const res = await updateField(collection.id, {
                  ...collection.properties,
                  [propertyId]: {
                    ...collection.properties[propertyId],
                    options: collection.properties[propertyId].options?.map(
                      (o) => {
                        if (o.value === option.value) {
                          return {
                            ...o,
                            label: e.target.value,
                          };
                        }
                        return o;
                      }
                    ),
                  },
                });
                if (res.id) {
                  updateCollection(res);
                } else {
                  logError("Error updating option");
                }
              }}
            />
          </Stack>
        ))}
        {allowCustom && (
          <Input
            ref={inputRef}
            label=""
            placeholder="Custom answer"
            defaultValue={selected?.label}
            disabled
          />
        )}
        <Box
          style={{
            opacity: 0.2,
          }}
          cursor="pointer"
          onClick={async () => {
            const optionId = uuid();
            const res = await updateField(collection.id, {
              ...collection.properties,
              [propertyId]: {
                ...collection.properties[propertyId],
                options: [
                  ...(collection.properties[propertyId].options || []),
                  { label: "New Option", value: optionId },
                ],
              },
            });
            if (res.id) {
              updateCollection(res);
            } else {
              logError("Error adding new option");
            }
          }}
        >
          <Stack direction="horizontal" align="center" space="2">
            <input
              name={propertyId}
              type="radio"
              style={{
                width: "20px",
                height: "20px",
                cursor: "pointer",
              }}
            />
            {/* <NameInput defaultValue={"Add New Option"} disabled /> */}
            <Box marginTop="1">
              <Text>Add New Option</Text>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

const NameInput = styled.input`
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1rem;
  caret-color: rgb(255, 255, 255, 0.7);
  color: rgb(255, 255, 255, 0.7);
  overflow: hidden;
  margin-top: 4px;
`;

export default EditableSingleSelect;
