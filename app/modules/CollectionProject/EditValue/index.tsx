/* eslint-disable @typescript-eslint/no-explicit-any */
import Popover from "@/app/common/components/Popover";
import { Box, IconClose, Stack, Tag, Text } from "degen";
import { motion } from "framer-motion";
import { matchSorter } from "match-sorter";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

type Props = {
  value: any;
  setValue: (value: any) => void;
  propertyName: string;
};

function EditValue({ value, setValue, propertyName }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const fieldInput = useRef<any>();
  const { localCollection: collection } = useLocalCollection();
  const property = collection.properties[propertyName];
  const [options, setOptions] = useState<any>([]);
  const [filteredOptions, setFilteredOptions] = useState<any>([]);

  useEffect(() => {
    if (property.type === "singleSelect" || property.type === "multiSelect") {
      setOptions(property.options);
      setFilteredOptions(property.options);
    } else if (property.type === "user" || property.type === "user[]") {
      void (async () => {
        const res = await (
          await fetch(
            `${process.env.API_HOST}/circle/${
              collection.parents[0].id || collection.parents[0]
            }/memberDetails?circleIds=${
              collection.parents[0].id || collection.parents[0]
            }`
          )
        ).json();
        const memberOptions = res.members?.map((member: string) => ({
          label: res.memberDetails && res.memberDetails[member]?.username,
          value: member,
        }));
        setOptions(memberOptions);
        setFilteredOptions(memberOptions);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyName]);

  return (
    <Box width="3/4">
      {["singleSelect", "multiSelect", "user", "user[]"].includes(
        property.type
      ) && (
        <Popover
          isOpen={isEditing}
          setIsOpen={setIsEditing}
          dependentRef={fieldInput}
          butttonComponent={
            <Box>
              {isEditing ? (
                <FieldInputContainer
                  ref={fieldInput}
                  padding={
                    ["multiSelect", "user[]"].includes(property.type)
                      ? "2"
                      : "0"
                  }
                >
                  <Stack direction="horizontal" wrap space="2">
                    {["multiSelect", "user[]"].includes(property.type) &&
                      value?.map((val: any) => (
                        <Tag key={val.value} tone="accent" hover>
                          <Stack
                            direction="horizontal"
                            space="1"
                            align="center"
                          >
                            {val.label}
                            <Box
                              cursor="pointer"
                              onClick={() => {
                                setValue(
                                  value.filter(
                                    (v: any) => v.value !== val.value
                                  )
                                );
                              }}
                            >
                              <IconClose size="4" color="red" />
                            </Box>
                          </Stack>
                        </Tag>
                      ))}
                    <FieldInput
                      autoFocus
                      defaultValue={value?.label}
                      onChange={(e) => {
                        setFilteredOptions(
                          matchSorter(options, e.target.value, {
                            keys: ["value", "label"],
                          })
                        );
                      }}
                    />
                  </Stack>
                </FieldInputContainer>
              ) : (
                <FieldButton onClick={() => setIsEditing(true)}>
                  {["multiSelect", "user[]"].includes(property.type) ? (
                    value?.length ? (
                      value?.map((val: any) => (
                        <Tag key={val.value} tone="accent" hover>
                          {val.label}
                        </Tag>
                      ))
                    ) : (
                      "Empty"
                    )
                  ) : value ? (
                    <Text>{value.label}</Text>
                  ) : (
                    "Empty"
                  )}
                </FieldButton>
              )}
            </Box>
          }
        >
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto", transition: { duration: 0.2 } }}
            exit={{ height: 0 }}
            style={{
              overflow: "hidden",
            }}
          >
            <Box backgroundColor="background">
              <MenuContainer>
                <Stack space="0">
                  {filteredOptions?.map((option: any) => (
                    <MenuItem
                      padding="2"
                      key={option.value}
                      onClick={() => {
                        if (
                          property.type === "multiSelect" ||
                          property.type === "user[]"
                        ) {
                          if (!value) {
                            setValue([option]);
                          } else {
                            if (
                              !value.find(
                                (val: any) => val.value === option.value
                              )
                            )
                              setValue([...value, option]);
                          }
                        } else {
                          setValue(option);
                          setIsEditing(false);
                        }
                      }}
                    >
                      <Text>{option.label}</Text>
                    </MenuItem>
                  ))}
                  {!filteredOptions?.length && (
                    <MenuItem padding="2">
                      <Text variant="label">No options found</Text>
                    </MenuItem>
                  )}
                </Stack>
              </MenuContainer>
            </Box>
          </motion.div>
        </Popover>
      )}
      {["shortText", "number", "ethAddress", "email", "date"].includes(
        property.type
      ) && (
        <Box>
          {isEditing ? (
            <FieldInputContainer>
              <FieldInput
                autoFocus
                ref={fieldInput}
                defaultValue={value}
                onChange={(e) => {
                  if (property.type === "number") {
                    setValue(Number(e.target.value));
                  } else {
                    setValue(e.target.value);
                  }
                }}
                onBlur={() => setIsEditing(false)}
                type={
                  property.type === "number"
                    ? "number"
                    : property.type === "date"
                    ? "date"
                    : property.type === "email"
                    ? "email"
                    : "text"
                }
              />
            </FieldInputContainer>
          ) : (
            <FieldButton onClick={() => setIsEditing(true)}>
              {value ? <Text>{value}</Text> : "Empty"}
            </FieldButton>
          )}
        </Box>
      )}
    </Box>
  );
}

export default EditValue;

const FieldButton = styled.div`
  width: 30rem;
  color: rgb(255, 255, 255, 0.25);
  padding: 0.5rem 0.5rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;

  &:hover {
    cursor: pointer;
    background: rgb(191, 90, 242, 0.1);
  }

  transition: background 0.2s ease;
`;

const FieldInputContainer = styled(Box)`
  width: 30rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgb(191, 90, 242, 0.1);
`;

const FieldInput = styled.input`
  outline: none;
  border-color: transparent;
  padding: 0.45rem 0.3rem;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  font-size: 0.95rem;
  background: transparent;
  color: rgb(255, 255, 255, 0.7);
  font-family: "Inter", sans-serif;
  width: 100%;
`;

const MenuContainer = styled(Box)`
  width: 30rem;
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  background: rgb(191, 90, 242, 0.05);
  transition: all 0.15s ease-out;

  max-height: 20rem;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0.5rem;
  }
`;

const MenuItem = styled(Box)`
  width: 100%;
  &:hover {
    cursor: pointer;
    background: rgb(191, 90, 242, 0.1);
  }
  transition: background 0.2s ease;
`;
