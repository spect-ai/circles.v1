import { Option } from "@/app/types";
import { Box, Button, IconClose, IconTrash, Input, Stack, Text } from "degen";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { logError } from "@/app/common/utils/utils";
import { updateField } from "@/app/services/Collection";
import { motion } from "framer-motion";
import { SelectInputComponent } from "@avp1598/vibes";

type Props = {
  options: Option[];
  selected: Option[];
  propertyId: string;
  focused: boolean;
  disabled?: boolean;
};

const EditableMultiSelect = ({
  options,
  selected,
  propertyId,
  focused,
}: Props) => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [allowCustom, setAllowCustom] = useState(false);
  const [optionHover, setOptionHover] = useState("none");

  useEffect(() => {
    if (allowCustom && !options.some((o) => o.value === "__custom__")) {
      options.push({ label: "Other", value: "__custom__" });
    }
  }, []);

  const inputRef: any = useRef();

  return (
    <Box>
      <Stack>
        {options?.map((option) => (
          <Box
            key={option.value}
            onMouseEnter={() => setOptionHover(option.value)}
            onMouseLeave={() => setOptionHover("none")}
          >
            <Stack
              key={option.value}
              direction="horizontal"
              align="center"
              space="2"
            >
              <SelectInputComponent
                name={propertyId}
                value={selected}
                isMulti={true}
                option={{
                  label: "",
                  value: option.value,
                }}
              />
              <NameInput
                defaultValue={option.label}
                onBlur={async (e) => {
                  const res = await updateField(collection.id, {
                    id: propertyId,
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
                  });
                  if (res.id) {
                    updateCollection(res);
                  } else {
                    logError("Error updating option");
                  }
                }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: focused ? 1 : 0,
                }}
              >
                <Button
                  shape="circle"
                  size="extraSmall"
                  variant="transparent"
                  onClick={async () => {
                    const tempCollection = collection;
                    updateCollection({
                      ...tempCollection,
                      properties: {
                        ...tempCollection.properties,
                        [propertyId]: {
                          ...tempCollection.properties[propertyId],
                          options: tempCollection.properties[
                            propertyId
                          ].options?.filter((o) => o.value !== option.value),
                        },
                      },
                    });

                    const res = await updateField(collection.id, {
                      id: propertyId,
                      options: collection.properties[
                        propertyId
                      ].options?.filter((o) => o.value !== option.value),
                    });
                    if (res.id) {
                      // updateCollection(res);
                      console.log("res", res);
                    } else {
                      updateCollection(tempCollection);
                      logError("Error deleting option");
                    }
                  }}
                >
                  <IconClose size="4" />
                </Button>
              </motion.div>
            </Stack>
          </Box>
        ))}
        {allowCustom && (
          <Input
            ref={inputRef}
            label=""
            placeholder="Custom answer"
            defaultValue={selected[0]?.label}
            disabled
          />
        )}
        {focused && (
          <Box
            style={{
              opacity: 0.2,
            }}
            cursor="pointer"
            onClick={async () => {
              const tempCollection = collection;
              updateCollection({
                ...tempCollection,
                properties: {
                  ...tempCollection.properties,
                  [propertyId]: {
                    ...tempCollection.properties[propertyId],
                    options: [
                      ...(tempCollection.properties[propertyId].options || []),
                      { label: "New Option", value: uuid() },
                    ],
                  },
                },
              });
              const optionId = uuid();
              const res = await updateField(collection.id, {
                id: propertyId,
                options: [
                  ...(collection.properties[propertyId].options || []),
                  { label: "New Option", value: optionId },
                ],
              });
              if (res.id) {
                // updateCollection(res);
                console.log("res", res);
              } else {
                updateCollection(tempCollection);
                logError("Error adding new option");
              }
            }}
          >
            <Box marginTop="0">
              <Text>Add New Option</Text>
            </Box>
          </Box>
        )}
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
`;

export default EditableMultiSelect;
