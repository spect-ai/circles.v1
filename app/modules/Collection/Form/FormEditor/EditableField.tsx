import React, { useRef } from "react";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import {
  Box,
  Button,
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
import { ConditionGroup, Option, PropertyType, Registry } from "@/app/types";
import {
  FaDiscord,
  FaGithub,
  FaTelegramPlane,
  FaTwitter,
} from "react-icons/fa";
import Dropdown from "@/app/common/components/Dropdown";
import { fieldOptionsDropdownInForms, fields } from "../../Constants";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import EditableSingleSelect from "./EditableSingleSelect";
import EditableMultiSelect from "./EditableMultiSelect";
import { Draggable } from "react-beautiful-dnd";

import { motion } from "framer-motion";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import RewardTokenOptions from "../../AddField/RewardTokenOptions";
import { updateField } from "@/app/services/Collection";
import { logError } from "@/app/common/utils/utils";
import CheckBox from "@/app/common/components/Table/Checkbox";
// import { useClickAway } from "react-use";
import Switch from "@/app/common/components/Switch";
import { RiDraggable } from "react-icons/ri";
import { FormProvider } from "@avp1598/vibes";
import RewardField from "@/app/modules/PublicForm/Fields/RewardField";
import Slider from "@/app/common/components/Slider";
import { useClickAway } from "react-use";
import Accordian from "@/app/common/components/Accordian";
import AddAdvancedConditions from "../../Common/AddAdvancedConditions";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import { prevPropertyTypeToNewPropertyTypeThatDoesntRequiresClarance } from "@/app/common/utils/constants";

type Props = {
  pageId: string;
  id: string;
  index: number;
  setShowConfirmOnDelete: (show: boolean) => void;
  setPropertyId: (id: string | null) => void;
};

const EditableField = ({
  pageId,
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
  const [isDirty, setIsDirty] = useState(false);
  const [allowCustom, setAllowCustom] = useState(false);
  const [maxSelections, setMaxSelections] = useState<number>();
  const [immutable, setImmutable] = useState(false);
  const [required, setRequired] = useState(false);
  const [defaultRewardOptions, setDefaultRewardOptions] = useState<Registry>(
    {}
  );
  const [advancedConditions, setAdvancedConditions] = useState<ConditionGroup>(
    (id && collection.properties[id]?.advancedConditions) ||
      ({} as ConditionGroup)
  );
  const [advancedDefaultOpen, setAdvancedDefaultOpen] = useState(
    advancedConditions?.order?.length > 0 ? true : false
  );

  const [focused, setFocused] = useState(false);

  const [memberOptions, setMemberOptions] = useState([]);
  const [fetchingMemberOptions, setFetchingMemberOptions] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const [rating, setRating] = useState({
    min: collection.properties[id]?.sliderOptions?.min || 1,
    max: collection.properties[id]?.sliderOptions?.max || 10,
    minLabel: collection.properties[id]?.sliderOptions?.minLabel || "",
    maxLabel: collection.properties[id]?.sliderOptions?.maxLabel || "",
  });

  const containerRef = useRef(null);
  useClickAway(containerRef, () => {
    setFocused(false);
  });

  let validConditionFields = [] as string[];
  if (collection.collectionType === 0) {
    if (id) {
      const fieldSortedByLocations = [] as string[];
      for (const page of collection.formMetadata.pageOrder) {
        fieldSortedByLocations.push(
          ...collection.formMetadata.pages[page].properties
        );
      }
      for (const field of fieldSortedByLocations) {
        if (field !== id) {
          validConditionFields.push(field);
        } else break;
      }
    } else {
      const currPageIndex = collection.formMetadata.pageOrder.indexOf(
        pageId || ""
      );
      for (const page of collection.formMetadata.pageOrder.slice(
        0,
        currPageIndex + 1
      )) {
        validConditionFields.push(
          ...collection.formMetadata.pages[page].properties
        );
      }
    }
    validConditionFields = validConditionFields
      .filter((field) => collection.properties[field].type !== "multiURL")
      .filter((field) => collection.properties[field].isPartOfFormView);
  } else if (collection.collectionType === 1) {
    validConditionFields = Object.keys(collection.properties).filter(
      (field) => collection.properties[field].type !== "multiURL"
    );
  }

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

  const handleSliderChange = async (fieldToUpdate: keyof typeof rating) => {
    try {
      const res = await updateField(collection.id, {
        id: collection.properties[id].id,
        sliderOptions: {
          min: rating.min,
          max: rating.max,
          minLabel: rating.minLabel,
          maxLabel: rating.maxLabel,
          step: 1,
        },
      });

      if (res.id) {
        updateCollection(res);
      } else {
        setRating({ ...rating, [fieldToUpdate]: rating[fieldToUpdate] });
        logError("Error updating field");
      }
    } catch (error) {
      // Handle API error
      console.error(error);
      logError("Error updating field");
    }
  };

  useEffect(() => {
    if (
      collection.parents &&
      (collection.properties[id]?.type === "user" ||
        collection.properties[id]?.type === "user[]")
    ) {
      void (async () => {
        setFetchingMemberOptions(true);
        const res = await (
          await fetch(
            `${process.env.API_HOST}/circle/${collection.parents[0].id}/memberDetails?circleIds=${collection.parents[0].id}`
          )
        ).json();
        const fetchedMemberOptions = res.members?.map((member: string) => ({
          label: res.memberDetails && res.memberDetails[member]?.username,
          value: member,
        }));
        if (fetchedMemberOptions.length !== memberOptions.length) {
          setMemberOptions(fetchedMemberOptions);
        }
        setFetchingMemberOptions(false);
      })();
    } else {
      setFetchingMemberOptions(false);
    }
  }, [collection.parents]);

  return (
    <Box ref={containerRef}>
      {showConfirm && (
        <ConfirmModal
          title={
            "This will remove existing data associated with this field as the field type is changed. Are you sure you want to continue?"
          }
          handleClose={() => setShowConfirm(false)}
          onConfirm={() => {
            onUpdateField(type);
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <FormProvider
        colorPalette={{}}
        formProps={{}}
        pageProps={{}}
        fieldProps={{}}
        buttonProps={{}}
        textProps={{}}
        logoProps={{}}
        optionProps={{}}
        tagProps={{}}
        stepperProps={{}}
      >
        <Draggable draggableId={id} index={index}>
          {(provided, snapshot) => (
            <Container
              paddingX="8"
              paddingY="4"
              marginTop="0"
              borderRadius="large"
              cursor={focused ? "default" : "pointer"}
              mode={mode}
              display="flex"
              backgroundColor={focused ? "background" : "backgroundSecondary"}
              onClick={() => {
                setFocused(true);
              }}
              ref={provided.innerRef}
              position={"relative"}
              isDragging={snapshot.isDragging}
              {...provided.draggableProps}
            >
              <Box position="absolute" left="0" top="6">
                <Box {...provided.dragHandleProps}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: focused ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Text color="accent">
                      <RiDraggable size={"28"} />
                    </Text>
                  </motion.div>
                </Box>
              </Box>
              <Box width="full" id="ref">
                <Stack space="2">
                  <Stack space="1">
                    {collection.properties[id]?.type !== "readonly" && (
                      <Box
                        width="full"
                        display="flex"
                        flexDirection="row"
                        gap="2"
                      >
                        <NameInput
                          defaultValue={collection.properties[id]?.name}
                          onBlur={async (e) => {
                            if (
                              e.target.value === collection.properties[id]?.name
                            )
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
                  <Stack space="4">
                    <Box>
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
                      {!fetchingMemberOptions &&
                        (collection.properties[id]?.type === "singleSelect" ||
                          collection.properties[id]?.type === "user") && (
                          <EditableSingleSelect
                            options={
                              collection.properties[id]?.type === "singleSelect"
                                ? (collection.properties[id]
                                    .options as Option[])
                                : memberOptions
                            }
                            selected={
                              collection.properties[id]?.type === "singleSelect"
                                ? (collection.properties[id]
                                    .options?.[0] as Option)
                                : memberOptions[0]
                            }
                            propertyId={id}
                            focused={focused}
                            userProperty={
                              collection.properties[id]?.type === "user"
                            }
                          />
                        )}
                      {!fetchingMemberOptions &&
                        (collection.properties[id]?.type === "multiSelect" ||
                          collection.properties[id]?.type === "user[]") && (
                          <EditableMultiSelect
                            options={
                              collection.properties[id]?.type === "multiSelect"
                                ? (collection.properties[id]
                                    ?.options as Option[])
                                : memberOptions
                            }
                            selected={
                              collection.properties[id]?.type === "multiSelect"
                                ? [
                                    collection.properties[id]
                                      ?.options as Option[],
                                  ][0]
                                : [memberOptions[0]]
                            }
                            propertyId={id}
                            focused={focused}
                            userProperty={
                              collection.properties[id]?.type === "user[]"
                            }
                          />
                        )}
                      {collection.properties[id]?.type === "reward" && (
                        <Box marginTop="-2">
                          <RewardField
                            rewardOptions={
                              collection.properties[id]?.rewardOptions ||
                              defaultRewardOptions
                            }
                            updateData={() => {}}
                            value={{} as any}
                            propertyId={id}
                          />
                        </Box>
                      )}
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
                      {collection.properties[id]?.type === "slider" && (
                        <Slider
                          label=""
                          min={
                            collection.properties[id]?.sliderOptions?.min || 1
                          }
                          max={
                            collection.properties[id]?.sliderOptions?.max || 10
                          }
                          value={{
                            label: "10",
                            value: "10",
                          }}
                          minLabel={
                            collection.properties[id]?.sliderOptions?.minLabel
                          }
                          maxLabel={
                            collection.properties[id]?.sliderOptions?.maxLabel
                          }
                          onChange={(value: any) => {}}
                        />
                      )}
                    </Box>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: focused && !snapshot.isDragging ? "auto" : 0,
                        opacity: focused && !snapshot.isDragging ? 1 : 0,
                      }}
                      style={{
                        overflow: "hidden",
                      }}
                    >
                      <Stack>
                        <Stack direction="horizontal" align="center" space="4">
                          <Box
                            width="1/3"
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                          >
                            <Dropdown
                              options={fieldOptionsDropdownInForms}
                              selected={type}
                              onChange={(type) => {
                                setType(type);
                                if (
                                  !prevPropertyTypeToNewPropertyTypeThatDoesntRequiresClarance[
                                    collection.properties[id].type
                                  ].includes(type.value) &&
                                  collection.data
                                ) {
                                  setShowConfirm(true);
                                } else {
                                  onUpdateField(type);
                                }
                              }}
                              multiple={false}
                              isClearable={false}
                              portal
                            />
                          </Box>
                          {/* <RadixSelect /> */}
                          <Button
                            tone="red"
                            shape="circle"
                            size="small"
                            variant="secondary"
                            onClick={() => {
                              setPropertyId(id);
                              setShowConfirmOnDelete(true);
                            }}
                          >
                            <IconTrash />
                          </Button>
                        </Stack>
                        {collection.properties[id]?.type !== "readonly" && (
                          <Stack
                            direction="horizontal"
                            align="center"
                            space="2"
                          >
                            <Switch
                              checked={required}
                              onChange={async (checked) => {
                                setRequired(checked);
                                const res = await updateField(collection.id, {
                                  ...collection.properties[id],
                                  required: checked,
                                });
                                if (res.id) {
                                  updateCollection(res);
                                } else {
                                  setRequired(checked);
                                  logError("Error updating field required");
                                }
                              }}
                            />
                            <Text variant="label">Required</Text>
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
                            <Switch
                              checked={allowCustom}
                              onChange={async (checked) => {
                                setAllowCustom(checked);
                                const res = await updateField(collection.id, {
                                  ...collection.properties[id],
                                  allowCustom: checked,
                                });
                                if (res.id) {
                                  updateCollection(res);
                                } else {
                                  setAllowCustom(checked);
                                  logError(
                                    "Error updating field custom answer"
                                  );
                                }
                              }}
                            />
                            <Text variant="label">Allow custom answer</Text>
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
                            <Switch
                              checked={immutable}
                              onChange={async (checked) => {
                                setImmutable(checked);
                                const res = await updateField(collection.id, {
                                  ...collection.properties[id],
                                  immutable: checked,
                                });
                                if (res.id) {
                                  updateCollection(res);
                                } else {
                                  setImmutable(!checked);
                                  logError("Error updating field immutability");
                                }
                              }}
                            />
                            <Text variant="label">Immutable</Text>
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
                              // placeholder="2"
                              type="number"
                              step={1}
                            />
                            <Text variant="label">Max selections</Text>
                          </Stack>
                        )}
                        {collection.properties[id]?.type === "slider" && (
                          <Stack>
                            <Stack direction="horizontal">
                              <Input
                                label="Min"
                                value={rating.min}
                                type="number"
                                onChange={(e) => {
                                  setRating({
                                    ...rating,
                                    min: parseInt(e.target.value),
                                  });
                                }}
                                onBlur={() => handleSliderChange("min")}
                              />
                              <Input
                                label="Max"
                                value={rating.max}
                                type="number"
                                onChange={(e) => {
                                  setRating({
                                    ...rating,
                                    max: parseInt(e.target.value),
                                  });
                                }}
                                onBlur={() => handleSliderChange("max")}
                              />
                            </Stack>
                            <Stack direction="horizontal">
                              <Input
                                label="Min Label"
                                value={rating.minLabel}
                                onChange={(e) => {
                                  setRating({
                                    ...rating,
                                    minLabel: e.target.value,
                                  });
                                }}
                                onBlur={() => handleSliderChange("minLabel")}
                              />
                              <Input
                                label="Max Label"
                                value={rating.maxLabel}
                                onChange={(e) => {
                                  setRating({
                                    ...rating,
                                    maxLabel: e.target.value,
                                  });
                                }}
                                onBlur={() => handleSliderChange("maxLabel")}
                              />
                            </Stack>
                          </Stack>
                        )}
                        <Accordian
                          name="Advanced"
                          defaultOpen={advancedDefaultOpen}
                        >
                          <AddAdvancedConditions
                            rootConditionGroup={advancedConditions}
                            setRootConditionGroup={(conditionGroup) => {
                              setIsDirty(true);
                              setAdvancedConditions(conditionGroup);
                            }}
                            firstRowMessage="When"
                            buttonText="Add Condition"
                            groupButtonText="Group Conditions"
                            collection={collection}
                            dropDownPortal={true}
                            validConditionFields={validConditionFields}
                          />
                        </Accordian>
                      </Stack>
                    </motion.div>
                  </Stack>
                  {collection.properties[id]?.type === "reward" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: focused ? 1 : 0,
                        height: focused ? "auto" : 0,
                      }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Box marginTop="2">
                        <RewardTokenOptions
                          networks={defaultRewardOptions}
                          setNetworks={setDefaultRewardOptions}
                          propertyId={id}
                        />
                      </Box>
                    </motion.div>
                  )}
                </Stack>
              </Box>
            </Container>
          )}
        </Draggable>
      </FormProvider>
    </Box>
  );
};

const Container = styled(Box)<{ isDragging: boolean; mode: string }>`
  opacity: ${(props) => (props.isDragging ? 0.5 : 1)};
  border: 1px solid
    ${(props) =>
      props.isDragging ? "rgb(255, 255, 255,0.1)" : "rgb(20,20,20,0.1)"};

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
  width: 48px;
`;

export default EditableField;
