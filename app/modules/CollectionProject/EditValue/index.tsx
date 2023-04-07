/* eslint-disable react/jsx-closing-tag-location */
import Popover from "@/app/common/components/Popover";
import { updateField } from "@/app/services/Collection";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { MemberDetails, Milestone, Option, Reward } from "@/app/types";
import { Avatar, Box, IconClose, Stack, Text, useTheme } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import { matchSorter } from "match-sorter";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import uuid from "react-uuid";
import styled from "styled-components";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import MultiMilestoneModal from "../../Collection/TableView/MultiMilestoneModal";
import RewardModal from "../../Collection/TableView/RewardModal";
import LongTextModal from "./LongTextModal";

type Props = {
  value: unknown;
  setValue: (value: unknown) => void;
  propertyName: string;
  dataId: string;
  disabled: boolean;
};

const FieldButton = styled.div<{ mode: string }>`
  width: 25rem;
  color: ${({ mode }) =>
    mode === "dark" ? "rgb(255, 255, 255, 0.25)" : "rgb(0, 0, 0, 0.25)"};
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
  width: 25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgb(191, 90, 242, 0.1);
`;

const FieldInput = styled.input<{ mode: string }>`
  outline: none;
  border-color: transparent;
  padding: 0.45rem 0.3rem;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  font-size: 0.95rem;
  background: transparent;
  color: ${({ mode }) =>
    mode === "dark" ? "rgb(255, 255, 255, 0.65)" : "rgb(0, 0, 0, 0.65)"};
  font-family: "Inter", sans-serif;
  width: 100%;
`;

export const MenuContainer = styled(Box)<{ cWidth?: string }>`
  width: ${(props) => props.cWidth || "25rem"};
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  background: rgb(28, 25, 31);
  transition: all 0.15s ease-out;

  max-height: 20rem;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  @media (max-width: 768px) {
    width: 15rem;
  }
`;

export const MenuItem = styled(Box)`
  width: 100%;
  &:hover {
    cursor: pointer;
    background: rgb(191, 90, 242, 0.1);
  }
  transition: background 0.2s ease;
`;

export const CustomTag = styled(Box)<{ mode: string; borderCol?: string }>`
  border-radius: 1.5rem;
  border: solid 2px ${(props) => props.borderCol || "rgb(191, 90, 242, 0.1)"};
  transition: all 0.3s ease-in-out;
  padding: 0.1rem 0.5rem;
  justify-content: center;
  align-items: center;
  overflow: auto;
`;

type Credential = {
  id: string;
  username: string;
  login: string;
};

const EditValue = ({
  value,
  setValue,
  propertyName,
  dataId,
  disabled,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldInput = useRef<any>();
  const {
    localCollection: collection,
    updateCollection,
    colorMapping,
  } = useLocalCollection();
  const property = collection.properties[propertyName];
  const [options, setOptions] = useState<Option[] | undefined>([]);
  const [filteredOptions, setFilteredOptions] = useState<Option[] | undefined>(
    []
  );
  const [tempValue, setTempValue] = useState<unknown>();
  const router = useRouter();

  const { mode } = useTheme();
  const { circle: cId } = router.query;

  const { formActions } = useRoleGate();
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  // TODO: Too many calls for no reason, can we pass this instead?
  useEffect(() => {
    if (property) {
      if (property.type === "singleSelect" || property.type === "multiSelect") {
        setOptions(property.options);
        setFilteredOptions(property.options);
      } else if (property.type === "user" || property.type === "user[]") {
        if (memberDetails) {
          const memberOptions = memberDetails.members?.map(
            (member: string) => ({
              label:
                memberDetails.memberDetails &&
                memberDetails.memberDetails[member]?.username,
              value: member,
            })
          );
          setOptions(memberOptions);
          setFilteredOptions(memberOptions);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyName]);

  if (!property) return null;

  return (
    <Box width="3/4">
      {["singleSelect", "multiSelect", "user", "user[]"].includes(
        property?.type
      ) && (
        <Popover
          width="full"
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
                      (value as Option[])?.map((val) => (
                        <CustomTag
                          mode={mode}
                          key={val.value}
                          borderCol={colorMapping[val.value]}
                        >
                          <Stack
                            direction="horizontal"
                            space="1"
                            align="center"
                          >
                            <Text>{val.label}</Text>
                            <Box
                              cursor="pointer"
                              onClick={() => {
                                const change = (value as Option[]).filter(
                                  (v) => v.value !== val.value
                                );
                                setValue(change);
                              }}
                            >
                              <IconClose size="4" color="red" />
                            </Box>
                          </Stack>
                        </CustomTag>
                      ))}
                    <FieldInput
                      mode={mode}
                      autoFocus
                      value={tempValue as string}
                      onChange={(e) => {
                        setTempValue(e.target.value);
                        options &&
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
                <FieldButton
                  onClick={() => {
                    if (disabled) {
                      toast.error("You can't edit a closed card");
                      return;
                    }
                    if (!formActions("updateResponsesManually")) {
                      toast.error(
                        "Your role doesn't have permission to update cards"
                      );
                    } else setIsEditing(true);
                  }}
                  mode={mode}
                >
                  {["multiSelect", "user[]"].includes(property.type) ? (
                    (value as Option[])?.length ? (
                      (value as Option[])?.map((val) => (
                        <Box
                          cursor="pointer"
                          key={val.value}
                          onClick={(e) => {
                            if (property.type === "user[]") {
                              e.stopPropagation();
                              // open new tab and direct to profile
                              window.open(`/profile/${val.label}`, "_blank");
                            }
                          }}
                        >
                          <CustomTag
                            mode={mode}
                            key={val.value}
                            borderCol={colorMapping[val.value]}
                          >
                            {" "}
                            {property.type === "multiSelect" && (
                              <Text> {val.label}</Text>
                            )}
                            {property.type === "user[]" && (
                              <Stack
                                direction="horizontal"
                                space="1"
                                align="center"
                              >
                                <Avatar
                                  src={
                                    memberDetails?.memberDetails?.[val.value]
                                      ?.avatar ||
                                    `https://api.dicebear.com/5.x/thumbs/svg?seed=${
                                      memberDetails?.memberDetails?.[val.value]
                                        ?.id
                                    }`
                                  }
                                  label=""
                                  size="5"
                                />
                                <Text weight="semiBold">
                                  {
                                    memberDetails?.memberDetails?.[val.value]
                                      ?.username
                                  }
                                </Text>
                              </Stack>
                            )}
                          </CustomTag>
                        </Box>
                      ))
                    ) : (
                      "Empty"
                    )
                  ) : value ? (
                    <Box
                      cursor="pointer"
                      onClick={(e) => {
                        if (property.type === "user") {
                          e.stopPropagation();
                          // open new tab and direct to profile
                          window.open(
                            `/profile/${(value as Option).label}`,
                            "_blank"
                          );
                        }
                      }}
                    >
                      <CustomTag
                        mode={mode}
                        borderCol={colorMapping[(value as Option).value]}
                      >
                        {property.type === "user" && (
                          <Stack
                            direction="horizontal"
                            space="1"
                            align="center"
                          >
                            <Avatar
                              src={
                                memberDetails?.memberDetails?.[
                                  (value as Option).value
                                ]?.avatar ||
                                `https://api.dicebear.com/5.x/thumbs/svg?seed=${
                                  memberDetails?.memberDetails?.[
                                    (value as Option).value
                                  ]?.id
                                }`
                              }
                              label=""
                              size="5"
                            />
                            <Text weight="semiBold">
                              {
                                memberDetails?.memberDetails?.[
                                  (value as Option).value
                                ]?.username
                              }
                            </Text>
                          </Stack>
                        )}
                        {property.type === "singleSelect" && (
                          <Text>{(value as Option).label}</Text>
                        )}
                      </CustomTag>
                    </Box>
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
                  {filteredOptions?.map((option) => (
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
                          } else if (
                            !(value as Option[]).find(
                              (val) => val.value === option.value
                            )
                          ) {
                            setValue([...(value as Option[]), option]);
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
                  {tempValue && property.type === "multiSelect" && (
                    <MenuItem
                      padding="2"
                      onClick={async () => {
                        if (options) {
                          const newId = uuid();
                          const res = await updateField(
                            collection.id,
                            propertyName,
                            {
                              options: [
                                ...options,
                                { label: tempValue as string, value: newId },
                              ],
                            }
                          );
                          if (!res.id) {
                            toast.error("Failed to update field");
                            return;
                          }
                          if (!res.id) {
                            toast.error("Failed to update collection");
                            return;
                          }
                          updateCollection(res);

                          setOptions([
                            ...options,
                            { label: tempValue as string, value: newId },
                          ]);
                          setFilteredOptions([
                            ...options,
                            { label: tempValue as string, value: newId },
                          ]);
                          if (
                            property.type === "multiSelect" ||
                            property.type === "user[]"
                          ) {
                            if (!value) {
                              setValue([{ label: tempValue, value: newId }]);
                            } else if (
                              !(value as Option[]).find(
                                (val) => val.value === tempValue
                              )
                            ) {
                              setValue([
                                ...(value as Option[]),
                                { label: tempValue, value: newId },
                              ]);
                            }
                          } else {
                            setValue({ label: tempValue, value: newId });
                            setIsEditing(false);
                          }
                        }
                      }}
                    >
                      <Text variant="label">{`Add "${tempValue}" option`}</Text>
                    </MenuItem>
                  )}
                </Stack>
              </MenuContainer>
            </Box>
          </motion.div>
        </Popover>
      )}
      {[
        "shortText",
        "number",
        "ethAddress",
        "email",
        "date",
        "singleURL",
      ].includes(property?.type) && (
        <Box>
          {isEditing ? (
            <FieldInputContainer>
              <FieldInput
                mode={mode}
                autoFocus
                ref={fieldInput}
                defaultValue={
                  property.type === "date"
                    ? value
                      ? new Date(value as string).toISOString().split("T")[0]
                      : ""
                    : (value as string)
                }
                onChange={(e) => {
                  if (property.type === "number") {
                    setTempValue(Number(e.target.value));
                  } else {
                    setTempValue(e.target.value);
                  }
                }}
                onBlur={() => {
                  setValue(tempValue);
                  setIsEditing(false);
                }}
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
            <FieldButton
              onClick={() => {
                if (disabled) {
                  toast.error("You can't edit a closed card");
                  return;
                }
                setIsEditing(true);
              }}
              mode={mode}
            >
              {value ? (
                <Text>
                  {property.type === "date"
                    ? new Date(value as string).toDateString()
                    : value}
                </Text>
              ) : (
                "Empty"
              )}
            </FieldButton>
          )}
        </Box>
      )}
      {["discord", "telegram", "github"].includes(property?.type) && (
        <Box>
          {isEditing ? (
            <FieldInputContainer>
              <FieldInput
                mode={mode}
                autoFocus
                ref={fieldInput}
                defaultValue={
                  (value as Credential)?.username ||
                  (value as Credential)?.login ||
                  (value as string)
                }
                onChange={(e) => {
                  setTempValue(e.target.value);
                }}
                onBlur={() => {
                  setValue(tempValue);
                  setIsEditing(false);
                }}
              />
            </FieldInputContainer>
          ) : (
            <FieldButton
              onClick={() => {
                if (disabled) {
                  toast.error("You can't edit a closed card");
                  return;
                }
                if (Object.keys(value || {}).length === 0) {
                  setIsEditing(true);
                }
              }}
              mode={mode}
            >
              {value ? (
                <Text>
                  {(value as Credential).username ||
                    (value as Credential).login ||
                    value}
                </Text>
              ) : (
                "Empty"
              )}
            </FieldButton>
          )}
        </Box>
      )}
      {["reward"].includes(property.type) && (
        <Box>
          <AnimatePresence>
            {isEditing && (
              <RewardModal
                form={collection}
                value={value}
                propertyName={propertyName}
                handleClose={(reward) => {
                  setIsEditing(false);
                  if (
                    ((!reward.value && reward.value !== 0) ||
                      !reward.token ||
                      !reward.chain) &&
                    dataId &&
                    !collection.data?.[dataId]?.[propertyName]?.value
                  ) {
                    return;
                  }
                  setValue(reward);
                }}
                dataId={dataId}
              />
            )}
          </AnimatePresence>
          <FieldButton
            onClick={() => {
              if (disabled) {
                toast.error("You can't edit a closed card");
                return;
              }
              setIsEditing(true);
            }}
            mode={mode}
          >
            {(value as Reward)?.value ? (
              <Text>{`${(value as Reward).value} ${
                (value as Reward).token.label
              } on ${(value as Reward).chain.label} network`}</Text>
            ) : (
              "Empty"
            )}
          </FieldButton>
        </Box>
      )}
      {["milestone"].includes(property.type) && (
        <Box>
          <AnimatePresence>
            {isEditing && (
              <MultiMilestoneModal
                form={collection}
                propertyName={propertyName}
                dataId={dataId}
                handleClose={(valueMilstone: Milestone[]) => {
                  setValue(valueMilstone);
                  setIsEditing(false);
                }}
              />
            )}
          </AnimatePresence>
          <FieldButton
            onClick={() => {
              if (disabled) {
                toast.error("You can't edit a closed card");
                return;
              }
              setIsEditing(true);
            }}
            mode={mode}
          >
            {value ? (
              <Text>{`${(value as Milestone[]).length} Milestones`}</Text>
            ) : (
              "Empty"
            )}
          </FieldButton>
        </Box>
      )}
      {["longText"].includes(property.type) && (
        <Box>
          <AnimatePresence>
            {isEditing && (
              <LongTextModal
                propertyName={propertyName}
                handleClose={(value2: string) => {
                  setValue(value2);
                  setIsEditing(false);
                }}
                value={value as string}
              />
            )}
          </AnimatePresence>
          <FieldButton
            onClick={() => {
              if (disabled) {
                toast.error("You can't edit a closed card");
                return;
              }
              setIsEditing(true);
            }}
            mode={mode}
          >
            {value ? <Text ellipsis>{value}</Text> : "Empty"}
          </FieldButton>
        </Box>
      )}
    </Box>
  );
};

export default EditValue;
