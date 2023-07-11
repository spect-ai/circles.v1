import React from "react";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import {
  Box,
  IconPlusSmall,
  IconTrash,
  Input,
  Stack,
  Tag,
  Text,
  useTheme,
} from "degen";
import styled from "styled-components";
import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Option, PropertyType, Registry } from "@/app/types";
import {
  FaDiscord,
  FaGithub,
  FaTelegramPlane,
  FaTwitter,
} from "react-icons/fa";
import Dropdown from "@/app/common/components/Dropdown";
import {
  fieldOptionsDropdownInForms,
  fieldOptionsDropdownInProjects,
  fields,
} from "../../Constants";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import EditableSingleSelect from "./EditableSingleSelect";
import EditableMultiSelect from "./EditableMultiSelect";
import { Draggable } from "react-beautiful-dnd";

import { RxDragHandleDots2 } from "react-icons/rx";
import { motion } from "framer-motion";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import RewardTokenOptions from "../../AddField/RewardTokenOptions";
import { updateField } from "@/app/services/Collection";
import { logError } from "@/app/common/utils/utils";
import CheckBox from "@/app/common/components/Table/Checkbox";

type Props = {
  id: string;
  index: number;
  setShowConfirmOnDelete: (show: boolean) => void;
  setPropertyId: (id: string | null) => void;
};

const EditableField = ({
  id,
  index,
  setShowConfirmOnDelete,
  setPropertyId,
}: Props) => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const { mode } = useTheme();
  const [type, setType] = useState({ label: "Short Text", value: "shortText" });
  const { registry, circle } = useCircle();

  const property = collection.properties[id];
  const [hover, setHover] = useState(false);

  const [isDirty, setIsDirty] = useState(false);

  const [allowCustom, setAllowCustom] = useState(false);
  const [maxSelections, setMaxSelections] = useState<number>();
  const [immutable, setImmutable] = useState(false);
  const [required, setRequired] = useState(false);

  const [defaultRewardOptions, setDefaultRewardOptions] = useState<Registry>(
    {}
  );

  useEffect(() => {
    if (circle && registry) {
      const chainId = circle.defaultPayment?.chain?.chainId;
      const tokenAddress = circle.defaultPayment?.token?.address;
      setDefaultRewardOptions({
        [chainId]: {
          ...(registry[chainId] || {}),
          [tokenAddress]: {
            ...(registry[chainId].tokenDetails[tokenAddress] || {}),
          },
        },
      });
    }
  }, [type]);

  useEffect(() => {
    setType({
      label:
        fields.find((field) => field.value === property?.type)?.label || "",
      value: property?.type,
    });
    setAllowCustom(property?.allowCustom || false);
    setMaxSelections(property?.maxSelections);
    setImmutable(property?.immutable || false);
    setRequired(property?.required || false);
  }, []);

  const onUpdateField = async (type: Option) => {
    const fieldOptions = [
      {
        label: "Option 1",
        value: `option-${uuid()}`,
      },
    ];
    const tempCollection = collection;
    updateCollection({
      ...tempCollection,
      properties: {
        ...tempCollection.properties,
        [id]: {
          ...tempCollection.properties[id],
          options: type.value.includes("Select") ? fieldOptions : undefined,
          type: type.value as PropertyType,
        },
      },
    });
    // setIsDirty(true);
    setType(type);
    const res = await updateField(collection.id, {
      ...collection.properties[id],
      type: type.value as PropertyType,
      options: type.value.includes("Select") ? fieldOptions : undefined,
    });

    if (res.id) {
      updateCollection(res);
    } else {
      updateCollection(tempCollection);
      logError("Error updating field type");
    }
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <Container
          padding="0"
          marginTop="4"
          borderRadius="large"
          mode={mode}
          isDragging={snapshot.isDragging}
          {...provided.draggableProps}
          ref={provided.innerRef}
          display="flex"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          backgroundColor="backgroundSecondary"
        >
          <Box
            style={{
              marginLeft: "-56px",
              marginRight: "8px",
              display: "flex",
              flexDirection: "row-reverse",
              gap: "8px",
            }}
          >
            <Box {...provided.dragHandleProps}>
              <motion.div
                whileHover={{ y: -5 }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: hover ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <Text color="textTertiary">
                  <RxDragHandleDots2 size={22} />
                </Text>
              </motion.div>
            </Box>
            <motion.div
              whileHover={{ y: -5, cursor: "pointer" }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: hover ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setPropertyId(id);
                setShowConfirmOnDelete(true);
              }}
            >
              <Text color="red">
                <IconTrash size="5" />
              </Text>
            </motion.div>
          </Box>
          <Box width="full">
            <Stack space="2">
              {/* {fieldNeedsAttention[id] && (
          <Text variant="small" color="yellow">
            Needs your attention
          </Text>
        )} */}
              <Stack space="1">
                {collection.properties[id]?.type !== "readonly" && (
                  <Box width="full" display="flex" flexDirection="row" gap="2">
                    <NameInput
                      defaultValue={collection.properties[id]?.name}
                      autoFocus
                      onBlur={async (e) => {
                        if (e.target.value === collection.properties[id]?.name)
                          return;
                        const res = await updateField(collection.id, {
                          ...collection.properties[id],
                          name: e.target.value,
                        });
                        if (res.id) {
                          updateCollection(res);
                        } else {
                          logError("Error updating field name");
                        }
                      }}
                    />
                    {collection.properties[id].required && (
                      <Tag size="small" tone="accent">
                        Required
                      </Tag>
                    )}
                    {collection.properties[id].immutable && (
                      <Tag size="small" tone="blue">
                        Immutable
                      </Tag>
                    )}
                  </Box>
                )}
                <Editor
                  value={collection.properties[id]?.description}
                  placeholder={
                    collection.properties[id]?.type === "readonly"
                      ? "Add text"
                      : "Add field description"
                  }
                  onChange={() => {
                    setIsDirty(true);
                  }}
                  onSave={async (val) => {
                    const res = await updateField(collection.id, {
                      ...collection.properties[id],
                      description: val,
                    });
                    setIsDirty(false);
                    if (res.id) {
                      updateCollection(res);
                    } else {
                      logError("Error updating field description");
                    }
                  }}
                  isDirty={isDirty}
                  version={2}
                />
              </Stack>
              {collection.properties[id]?.type !== "readonly" && (
                <Stack direction="horizontal" align="flex-start">
                  <Box width="2/3" marginTop="4">
                    {collection.properties[id]?.type === "shortText" && (
                      <Input
                        label=""
                        placeholder={`Enter short text`}
                        // value={collection.data && collection.data[id]}
                        // onChange={(e) => setLabel(e.target.value)}
                      />
                    )}
                    {collection.properties[id]?.type === "email" && (
                      <Input
                        label=""
                        placeholder={`Enter email`}
                        // value={collection.data && collection.data[id]}
                        inputMode="email"
                        // onChange={(e) => setLabel(e.target.value)}
                      />
                    )}
                    {collection.properties[id]?.type === "singleURL" && (
                      <Input
                        label=""
                        placeholder={`Enter URL`}
                        // value={collection.data && collection.data[id]}
                        inputMode="text"
                        // onChange={(e) => setLabel(e.target.value)}
                      />
                    )}
                    {collection.properties[id]?.type === "multiURL" && (
                      <Input
                        label=""
                        placeholder={`Enter URL`}
                        // value={collection.data && collection.data[id]?.[0]}
                        inputMode="text"
                        // onChange={(e) => setLabel(e.target.value)}
                      />
                    )}
                    {collection.properties[id]?.type === "number" && (
                      <Input
                        label=""
                        placeholder={`Enter number`}
                        // value={collection.data && collection.data[id]}
                        // onChange={(e) => setLabel(e.target.value)}
                        type="number"
                      />
                    )}
                    {collection.properties[id]?.type === "date" && (
                      <DateInput
                        placeholder={`Enter date`}
                        // value={collection.data && collection.data[id]}
                        // onChange={(e) => setLabel(e.target.value)}
                        type="date"
                        mode={mode}
                      />
                    )}
                    {collection.properties[id]?.type === "ethAddress" && (
                      <Input
                        label=""
                        placeholder={`Enter ethereum address or ENS`}
                        // value={collection.data && collection.data[id]}
                        // onChange={(e) => setLabel(e.target.value)}
                        // error={
                        //   collection.data &&
                        //   !ethers.utils.isAddress(collection.data && collection.data[id])
                        // }
                      />
                    )}
                    {collection.properties[id]?.type === "longText" && (
                      <Box
                        width="full"
                        borderWidth="0.375"
                        padding="4"
                        borderRadius="large"
                        maxHeight="64"
                        overflow="auto"
                        id="editorContainer"
                      >
                        <Editor
                          placeholder={`Enter long text, use / for commands`}
                          isDirty={true}
                          version={2}
                        />
                      </Box>
                    )}
                    {(collection.properties[id]?.type === "singleSelect" ||
                      collection.properties[id]?.type === "user") && (
                      <EditableSingleSelect
                        options={collection.properties[id].options as Option[]}
                        selected={
                          collection.properties[id].options?.[0] as Option
                        }
                        propertyId={id}
                        focused={hover}
                      />
                    )}
                    {(collection.properties[id]?.type === "multiSelect" ||
                      collection.properties[id]?.type === "user[]") && (
                      <EditableMultiSelect
                        options={collection.properties[id]?.options as Option[]}
                        selected={
                          [collection.properties[id]?.options as Option[]][0]
                        }
                        propertyId={id}
                        focused={hover}
                      />
                    )}
                    {/* {collection.properties[id]?.type === "reward" && (
                      <Box marginTop="-2">
                        <RewardField
                          rewardOptions={
                            collection.properties[id]?.rewardOptions ||
                            defaultRewardOptions
                          }
                          updateData={() => {}}
                          value={{} as any}
                        />
                      </Box>
                    )} */}
                    {collection.properties[id]?.type === "milestone" && (
                      <PrimaryButton
                        variant="tertiary"
                        icon={<IconPlusSmall />}
                        onClick={async () => {}}
                      >
                        Add new milestone
                      </PrimaryButton>
                    )}
                    {collection.properties[id]?.type === "discord" && (
                      <Box marginTop="2">
                        <PrimaryButton
                          variant="tertiary"
                          icon={<FaDiscord size={24} />}
                          onClick={async () => {}}
                        >
                          Connect Discord
                        </PrimaryButton>
                      </Box>
                    )}
                    {collection.properties[id]?.type === "twitter" && (
                      <PrimaryButton
                        variant="tertiary"
                        icon={<FaTwitter size={24} />}
                        onClick={async () => {}}
                      >
                        Connect Twitter
                      </PrimaryButton>
                    )}
                    {collection.properties[id]?.type === "telegram" && (
                      <Box marginTop="2">
                        <PrimaryButton
                          variant="tertiary"
                          icon={<FaTelegramPlane size={24} />}
                          onClick={async () => {}}
                        >
                          Connect Telegram
                        </PrimaryButton>
                      </Box>
                    )}
                    {collection.properties[id]?.type === "github" && (
                      <Box marginTop="2">
                        <PrimaryButton
                          variant="tertiary"
                          icon={<FaGithub size={24} />}
                          onClick={async () => {}}
                        >
                          Connect Github
                        </PrimaryButton>
                      </Box>
                    )}
                  </Box>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: hover ? 1 : 0,
                    }}
                    style={{
                      width: "33%",
                    }}
                  >
                    <Box width="full" marginTop="4">
                      <Stack>
                        <Dropdown
                          options={fieldOptionsDropdownInForms}
                          selected={type}
                          onChange={(type) => {
                            onUpdateField(type);
                          }}
                          multiple={false}
                          isClearable={false}
                        />
                        <Stack direction="horizontal" align="center" space="2">
                          <CheckBox
                            isChecked={required}
                            onClick={async () => {
                              setRequired(!required);
                              const res = await updateField(collection.id, {
                                ...collection.properties[id],
                                required: !required,
                              });
                              if (res.id) {
                                updateCollection(res);
                              } else {
                                setRequired(required);
                                logError("Error updating field required");
                              }
                            }}
                          />
                          <Text size="small" weight="light">
                            Required
                          </Text>
                        </Stack>
                        {(collection.properties[id]?.type === "singleSelect" ||
                          collection.properties[id]?.type ===
                            "multiSelect") && (
                          <Stack
                            direction="horizontal"
                            align="center"
                            space="2"
                          >
                            <CheckBox
                              isChecked={allowCustom}
                              onClick={async () => {
                                setAllowCustom(!allowCustom);
                                const res = await updateField(collection.id, {
                                  id: collection.properties[id].id,
                                  allowCustom: !allowCustom,
                                });
                                if (res.id) {
                                  updateCollection(res);
                                } else {
                                  setAllowCustom(allowCustom);
                                  logError(
                                    "Error updating field custom answer"
                                  );
                                }
                              }}
                            />
                            <Text size="small" weight="light">
                              Allow custom answer
                            </Text>
                          </Stack>
                        )}
                        {(collection.properties[id]?.type === "singleSelect" ||
                          collection.properties[id]?.type ===
                            "multiSelect") && (
                          <Stack
                            direction="horizontal"
                            align="center"
                            space="2"
                          >
                            <CheckBox
                              isChecked={immutable}
                              onClick={async () => {
                                setImmutable(!immutable);
                                const res = await updateField(collection.id, {
                                  id: collection.properties[id].id,
                                  immutable: !immutable,
                                });
                                if (res.id) {
                                  updateCollection(res);
                                } else {
                                  setImmutable(immutable);
                                  logError("Error updating field immutability");
                                }
                              }}
                            />
                            <Text size="small" weight="light">
                              Immutable
                            </Text>
                          </Stack>
                        )}
                        {collection.properties[id]?.type === "multiSelect" && (
                          <Stack
                            direction="horizontal"
                            align="center"
                            space="2"
                          >
                            <MaxSelectionsInput
                              value={maxSelections}
                              onChange={async (e) => {
                                const temp = maxSelections;
                                setMaxSelections(parseInt(e.target.value));
                                const res = await updateField(collection.id, {
                                  id: collection.properties[id].id,
                                  maxSelections: maxSelections,
                                });
                                if (res.id) {
                                  updateCollection(res);
                                } else {
                                  setMaxSelections(temp);
                                  logError("Error updating field immutability");
                                }
                              }}
                              placeholder="2"
                              type="number"
                              step={1}
                            />
                            <Text size="small" weight="light">
                              Max. selections
                            </Text>
                          </Stack>
                        )}
                      </Stack>
                    </Box>
                  </motion.div>
                </Stack>
              )}
              {collection.properties[id]?.type === "reward" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: hover ? 1 : 0,
                    height: hover ? "auto" : 0,
                  }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    width: "33%",
                  }}
                >
                  <Box marginTop="2">
                    <RewardTokenOptions
                      networks={defaultRewardOptions}
                      setNetworks={setDefaultRewardOptions}
                    />
                  </Box>
                </motion.div>
              )}
            </Stack>
          </Box>
        </Container>
      )}
    </Draggable>
  );
};

const Container = styled(Box)<{ isDragging: boolean; mode: string }>`
  opacity: ${(props) => (props.isDragging ? 0.95 : 1)};
  border-radius: 0.55rem;
  transition: border-color 0.5s ease;
`;

export const DateInput = styled.input<{ mode: string }>`
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

const NameInput = styled.input`
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.2rem;
  caret-color: rgb(255, 255, 255, 0.75);
  color: rgb(255, 255, 255, 0.75);
  font-weight: 600;
  overflow: hidden;
  width: 100%;
`;

const MaxSelectionsInput = styled.input`
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgb(255, 255, 255, 0.1);
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1rem;
  caret-color: rgb(255, 255, 255, 0.75);
  color: rgb(255, 255, 255, 0.75);
  overflow: hidden;
  width: 40px;
`;

export default EditableField;
