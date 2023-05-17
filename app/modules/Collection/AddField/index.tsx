/* eslint-disable @typescript-eslint/no-explicit-any */
import Accordian from "@/app/common/components/Accordian";
import Dropdown from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Tabs from "@/app/common/components/Tabs";
import { prevPropertyTypeToNewPropertyTypeThatDoesntRequiresClarance } from "@/app/common/utils/constants";
import { logError } from "@/app/common/utils/utils";
import {
  addField,
  deleteField,
  updateField,
  updateFormCollection,
} from "@/app/services/Collection";
import {
  CollectionType,
  ConditionGroup,
  FormUserType,
  PayWallOptions,
  Property,
  PropertyType,
  Registry,
} from "@/app/types";
import { SaveFilled } from "@ant-design/icons";
import { Box, IconTrash, Input, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useKeyPressEvent } from "react-use";
import { v4 as uuid } from "uuid";
import { useCircle } from "../../Circle/CircleContext";
import { quizValidFieldTypes } from "../../Plugins/common/ResponseMatchDistribution";
import AddAdvancedConditions from "../Common/AddAdvancedConditions";
import {
  fieldOptionsDropdownInForms,
  fieldOptionsDropdownInProjects,
  fields,
} from "../Constants";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import AddOptions from "./AddOptions";
import MilestoneOptions from "./MilestoneOptions";
import PayWall from "./PayWallOptions";
import RewardTokenOptions from "./RewardTokenOptions";
import { useKeyPressEvent } from "react-use";
import Editor from "@/app/common/components/Editor";
import { logError } from "@/app/common/utils/utils";
import { v4 as uuid } from "uuid";
import { quizValidFieldTypes } from "../../Plugins/common/ResponseMatchDistribution";
import SliderOptions from "./SliderOptions";

type Props = {
  propertyId?: string;
  pageId?: string;
  handleClose: () => void;
};

export default function AddField({ propertyId, pageId, handleClose }: Props) {
  const {
    localCollection: collection,
    updateCollection,
    setProjectViewId,
    reasonFieldNeedsAttention,
    getIfFieldNeedsAttention,
  } = useLocalCollection();
  const { registry, circle } = useCircle();
  const [networks, setNetworks] = useState(registry);
  const [payWallOption, setPayWallOption] = useState({
    network: {},
    value: 0,
    receiver: "",
  });
  const [initialName, setInitialName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState({ label: "Short Text", value: "shortText" });
  const [required, setRequired] = useState(0);

  const [defaultValue, setDefaultValue] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [fieldOptions, setFieldOptions] = useState([
    {
      label: "Option 1",
      value: `option-${uuid()}`,
    },
  ]);

  const [userType, setUserType] = useState<FormUserType>();
  const [showNameCollissionError, setShowNameCollissionError] = useState(false);
  const [showSlugNameError, setShowSlugNameError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmOnDelete, setShowConfirmOnDelete] = useState(false);
  const [showConfirmOnClose, setShowConfirmOnClose] = useState(false);

  // const [viewConditions, setViewConditions] = useState<Condition[]>(
  //   (propertyId && collection.properties[propertyId]?.viewConditions) || []
  // );
  const [advancedConditions, setAdvancedConditions] = useState<ConditionGroup>(
    (propertyId && collection.properties[propertyId]?.advancedConditions) ||
      ({} as ConditionGroup)
  );

  // const [modalSize, setModalSize] = useState<"small" | "medium" | "large">(
  //   viewConditions?.length > 0 ? "large" : "small"
  // );
  const [advancedDefaultOpen, setAdvancedDefaultOpen] = useState(
    advancedConditions?.order?.length > 0 ? true : false
  );
  const [reasonFieldNeedsUserAttention, setReasonFieldNeedsUserAttention] =
    useState(propertyId ? reasonFieldNeedsAttention[propertyId] : "");

  const [cardOrder, setCardOrder] = useState<any>();
  const [maxSelections, setMaxSelections] = useState<number>();
  const [allowCustom, setAllowCustom] = useState(false);
  const [immutable, setImmutable] = useState(false);

  const [isDirty, setIsDirty] = useState(false);
  const [initializing, setInitializing] = useState(propertyId ? true : false);

  const [sliderMin, setSliderMin] = useState(1);
  const [sliderMax, setSliderMax] = useState(5);
  const [sliderStep, setSliderStep] = useState(1);
  const [minLabel, setMinLabel] = useState("");
  const [maxLabel, setMaxLabel] = useState("");

  let validConditionFields = [] as string[];
  if (collection.collectionType === 0) {
    if (propertyId) {
      const fieldSortedByLocations = [] as string[];
      for (const page of collection.formMetadata.pageOrder) {
        fieldSortedByLocations.push(
          ...collection.formMetadata.pages[page].properties
        );
      }
      for (const field of fieldSortedByLocations) {
        if (field !== propertyId) {
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
  const [confirmMessage, setConfirmMessage] = useState(
    "This will remove existing data associated with this field as the field type is changed. Are you sure you want to continue?"
  );

  const onRequiredTabClick = (id: number) => {
    setIsDirty(true);
    setRequired(id);
  };

  useKeyPressEvent("Enter", () => {
    // check if no input is focused
    if (
      !document.activeElement?.className.includes("ProseMirror") &&
      !document.activeElement?.nodeName.includes("TEXTAREA") &&
      !document.activeElement?.nodeName.includes("INPUT")
    ) {
      if (name.trim() !== "" && !loading && !showNameCollissionError) {
        if (
          propertyId &&
          !prevPropertyTypeToNewPropertyTypeThatDoesntRequiresClarance[
            collection.properties[propertyId].type
          ].includes(type.value)
        ) {
          setShowConfirm(true);
        } else {
          onSave();
        }
      }
    }
  });

  const onSave = async () => {
    if (sliderMin >= sliderMax) {
      toast.error("Min value should be less than max value");
      return;
    }
    setLoading(true);
    let res: CollectionType | undefined;
    let rewardOptions = {} as Registry | undefined;
    let payWallOptions = {} as PayWallOptions;
    if (type.value === "reward" || type.value === "milestone") {
      rewardOptions = networks;
    }
    let milestoneFields = [] as string[];
    if (type.value === "milestone") {
      milestoneFields = ["name", "description", "dueDate", "reward"];
    }
    if (type.value === "payWall") {
      payWallOptions = payWallOption;
    }
    if (propertyId) {
      res = await updateField(collection.id, {
        id: propertyId,
        name: name.trim(),
        type: type.value as PropertyType,
        options: fieldOptions,
        rewardOptions,
        description,
        userType,
        default: defaultValue,
        isPartOfFormView: collection.properties[propertyId]?.isPartOfFormView,
        required: required === 1,
        milestoneFields,
        advancedConditions,
        payWallOptions,
        maxSelections,
        allowCustom,
        immutable,
        sliderOptions: {
          min: sliderMin,
          max: sliderMax,
          step: sliderStep,
          minLabel,
          maxLabel,
        },
      });
      if (collection.collectionType === 1 && res) {
        res = await updateFormCollection(collection.id, {
          projectMetadata: {
            ...res.projectMetadata,
            cardOrders: {
              ...(res.projectMetadata?.cardOrders || {}),
              [name.trim()]: cardOrder,
            },
          },
        });
      }
    } else {
      if (!pageId && collection.collectionType === 0) {
        logError("Pageid is missing in update, try again");
        return;
      }
      res = await addField(
        collection.id,
        {
          id: uuid(),
          name: name.trim(),
          type: type.value as PropertyType,
          isPartOfFormView: false,
          description,
          options: fieldOptions,
          rewardOptions,
          userType: userType,
          default: defaultValue,
          required: required === 1,
          milestoneFields,
          advancedConditions,
          payWallOptions,
          maxSelections,
          allowCustom,
          immutable,
          sliderOptions: {
            min: sliderMin,
            max: sliderMax,
            step: sliderStep,
            minLabel,
            maxLabel,
          },
        },
        pageId
      );
    }
    setIsDirty(false);
    setLoading(false);
    if (res?.id) {
      handleClose();
      updateCollection(res);
      if (
        collection.formMetadata?.responseDataForMintkudos &&
        quizValidFieldTypes.includes(type.value) &&
        propertyId &&
        collection.formMetadata.mintkudosTokenId
      ) {
        toast.warn(
          "A new valid field has been added, you can add this to your mint kudos match responses "
        );
      }
      if (
        collection.formMetadata?.responseDataForPoap &&
        quizValidFieldTypes.includes(type.value) &&
        propertyId &&
        collection.formMetadata.poapEventId
      ) {
        toast.warn(
          "A new valid field has been added, you can add this to your poap match responses "
        );
      }
    } else {
      logError((res as unknown as Error)?.message.toString());
    }
  };

  const updateRewardOptions = (property: Property) => {
    if (circle) {
      if (property?.rewardOptions) {
        setNetworks(property.rewardOptions);
      } else {
        if (
          circle.defaultPayment?.chain?.chainId &&
          circle.defaultPayment?.token?.address &&
          registry
        ) {
          const chainId = circle.defaultPayment?.chain?.chainId;
          const tokenAddress = circle.defaultPayment?.token?.address;
          setNetworks({
            [chainId]: {
              ...(registry[chainId] || {}),
              [tokenAddress]: {
                ...(registry[chainId].tokenDetails[tokenAddress] || {}),
              },
            },
          });
        }
      }
    }
  };

  useEffect(() => {
    if (
      propertyId &&
      collection.properties &&
      collection.properties[propertyId]
    ) {
      setInitializing(true);
      const property = collection.properties[propertyId];

      setName(property.name);
      setInitialName(property.name);
      setDescription(property?.description || "");
      setRequired(property?.required ? 1 : 0);
      setDefaultValue(property?.default);

      setType({
        label:
          fields.find((field) => field.value === property?.type)?.label || "",
        value: property?.type,
      });
      if (
        property.type === "singleSelect" ||
        property?.type === "multiSelect"
      ) {
        setFieldOptions(
          property?.options?.filter(
            (option) => option.value !== "__custom__"
          ) || []
        );
        setMaxSelections(property?.maxSelections);
        setAllowCustom(Boolean(property?.allowCustom));
        setImmutable(Boolean(property?.immutable));
      }
      if (property.type === "user") {
        setUserType(property.userType);
      }
      if (property.type === "reward") {
        updateRewardOptions(property);
      }
      if (property.type === "payWall") {
        setPayWallOption(property.payWallOptions as PayWallOptions);
      }
      if (property.type === "slider") {
        setSliderMin(property.sliderOptions?.min || 1);
        setSliderMax(property.sliderOptions?.max || 10);
        setSliderStep(property.sliderOptions?.step || 1);
        setMinLabel(property.sliderOptions?.minLabel || "");
        setMaxLabel(property.sliderOptions?.maxLabel || "");
      }
      setInitializing(false);
    }
  }, [collection.properties, propertyId]);

  useEffect(() => {
    if (type.value === "reward" || type.value === "milestone") {
      const property = collection?.properties?.[name];

      updateRewardOptions(property);
    }
  }, [type]);

  useEffect(() => {
    // setModalSize(viewConditions?.length > 0 ? "large" : "small");
    setAdvancedDefaultOpen(
      advancedConditions?.order?.length > 0 ? true : false
    );
  }, [advancedConditions]);

  useEffect(() => {
    if (propertyId && collection.projectMetadata?.cardOrders) {
      setCardOrder(collection.projectMetadata.cardOrders[propertyId]);
    }
  }, [collection.projectMetadata?.cardOrders, propertyId]);

  useEffect(() => {
    if (advancedConditions?.order && propertyId) {
      const res = getIfFieldNeedsAttention({
        id: propertyId,
        name: name.trim(),
        type: type.value as PropertyType,
        isPartOfFormView: false,
        description,
        options: fieldOptions,
        userType: userType,
        default: defaultValue,
        required: required === 1,
        advancedConditions,
        maxSelections,
        allowCustom,
      });
      setReasonFieldNeedsUserAttention(res?.reason);
    }
  }, [advancedConditions]);

  return (
    <Box>
      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal
            title={confirmMessage}
            handleClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              void onSave();
            }}
            onCancel={() => setShowConfirm(false)}
          />
        )}
        {showConfirmOnDelete && (
          <ConfirmModal
            title="This will remove existing data associated with this field, if you're looking to avoid this please set the field as inactive. Are you sure you want to delete this field?"
            handleClose={() => setShowConfirmOnDelete(false)}
            onConfirm={async () => {
              setDeleteLoading(true);
              setShowConfirmOnDelete(false);
              const res: CollectionType = await deleteField(
                collection.id,
                (propertyId as string).trim()
              );
              if (res.id) {
                res.collectionType === 1 &&
                  setProjectViewId(res.projectMetadata.viewOrder[0]);
                handleClose();
                updateCollection(res);
              } else {
                logError("Error deleting field");
              }
              setDeleteLoading(false);
            }}
            onCancel={() => setShowConfirmOnDelete(false)}
          />
        )}
        {showConfirmOnClose && (
          <ConfirmModal
            title="You have unsaved changes. Are you sure you want to close?"
            handleClose={() => setShowConfirmOnClose(false)}
            onConfirm={() => {
              setShowConfirmOnClose(false);
              handleClose();
            }}
            onCancel={() => setShowConfirmOnClose(false)}
          />
        )}
      </AnimatePresence>
      <Modal
        title={propertyId ? "Edit Field" : "Add Field"}
        handleClose={() => {
          if (isDirty) {
            setShowConfirmOnClose(true);
          } else {
            handleClose();
          }
        }}
        size={collection?.collectionType === 1 ? "small" : "medium"}
      >
        <Box padding="8">
          <Stack>
            <Input
              label=""
              placeholder="Field Name"
              value={name}
              onChange={(e) => {
                setIsDirty(true);
                setName(e.target.value);
                if (
                  collection.properties &&
                  collection.properties[e.target.value] &&
                  e.target.value !== initialName
                ) {
                  setShowNameCollissionError(true);
                } else setShowNameCollissionError(false);
                if (e.target.value === "slug") {
                  setShowSlugNameError(true);
                } else setShowSlugNameError(false);
              }}
            />

            {showNameCollissionError && (
              <Text color="red" size="small">
                Field name already exists
              </Text>
            )}
            {showSlugNameError && (
              <Text color="red" size="small">
                Field name cannot be slug
              </Text>
            )}
            {collection.collectionType === 0 && !initializing && (
              <Box
                width="full"
                borderRadius="large"
                maxHeight="56"
                overflow="auto"
                borderWidth="0.375"
                id="editorContainer"
                padding="4"
                key={type.value}
              >
                <Editor
                  value={description}
                  onChange={(value) => {
                    setIsDirty(true);
                    setDescription(value);
                  }}
                  placeholder={`Edit description`}
                  isDirty={isDirty}
                />
              </Box>
            )}
            {collection.collectionType === 0 && type.value !== "readonly" && (
              <Tabs
                selectedTab={required}
                onTabClick={onRequiredTabClick}
                tabs={["Optional", "Required"]}
                orientation="horizontal"
                unselectedColor="transparent"
              />
            )}
            <Dropdown
              options={
                collection?.collectionType === 1
                  ? fieldOptionsDropdownInProjects
                  : fieldOptionsDropdownInForms
              }
              selected={type}
              onChange={(type) => {
                setIsDirty(true);
                setType(type);
                if (type.value === "readonly") setRequired(0);
              }}
              multiple={false}
              isClearable={false}
            />
            {type.value === "singleSelect" || type.value === "multiSelect" ? (
              <AddOptions
                fieldOptions={fieldOptions}
                setFieldOptions={setFieldOptions}
                setCardOrder={setCardOrder}
                cardOrder={cardOrder}
                allowCustom={allowCustom}
                maxSelections={maxSelections}
                setMaxSelections={setMaxSelections}
                setAllowCustom={setAllowCustom}
                immutable={immutable}
                setImmutable={setImmutable}
                multiSelect={type.value === "multiSelect"}
                setIsDirty={setIsDirty}
              />
            ) : null}
            {type.value === "reward" && collection.collectionType === 0 && (
              <RewardTokenOptions
                networks={networks}
                setNetworks={setNetworks}
                setIsDirty={setIsDirty}
              />
            )}
            {type.value === "milestone" && (
              <MilestoneOptions
                networks={networks}
                setNetworks={setNetworks}
                setIsDirty={setIsDirty}
              />
            )}
            {type.value === "payWall" && (
              <PayWall
                payWallOption={payWallOption}
                setPayWallOption={setPayWallOption}
              />
            )}
            {type.value === "slider" && (
              <SliderOptions
                min={sliderMin}
                max={sliderMax}
                step={sliderStep}
                minLabel={minLabel}
                maxLabel={maxLabel}
                setMin={setSliderMin}
                setMax={setSliderMax}
                setStep={setSliderStep}
                setIsDirty={setIsDirty}
                setMinLabel={setMinLabel}
                setMaxLabel={setMaxLabel}
              />
            )}

            {collection.collectionType === 0 && (
              <Accordian name="Advanced" defaultOpen={advancedDefaultOpen}>
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
            )}

            {reasonFieldNeedsUserAttention && (
              <Text color="yellow" size="small">
                {reasonFieldNeedsUserAttention}
              </Text>
            )}

            <Box marginTop="8" display="flex" flexDirection="column" gap="2">
              <PrimaryButton
                icon={<SaveFilled style={{ fontSize: "1.3rem" }} />}
                loading={loading}
                disabled={showNameCollissionError || !name || !isDirty}
                onClick={async () => {
                  if (
                    ["singleSelect", "multiSelect"].includes(type.value) &&
                    !fieldOptions?.length
                  ) {
                    toast.error(
                      "Please add atleast one option before saving the field"
                    );
                    return;
                  }
                  if (
                    propertyId &&
                    collection.properties[propertyId].immutable &&
                    Object.keys(collection.data || {}).length > 0
                  ) {
                    setConfirmMessage(
                      "This will remove existing data associated with this field as this field is immutable. Are you sure you want to continue?"
                    );
                    setShowConfirm(true);
                  } else {
                    if (
                      propertyId &&
                      !prevPropertyTypeToNewPropertyTypeThatDoesntRequiresClarance[
                        collection.properties[propertyId].type
                      ].includes(type.value)
                    ) {
                      setShowConfirm(true);
                    } else {
                      await onSave();
                    }
                  }
                }}
              >
                Save
              </PrimaryButton>
              {propertyId && (
                <PrimaryButton
                  loading={deleteLoading}
                  tone="red"
                  icon={<IconTrash />}
                  onClick={() => {
                    setShowConfirmOnDelete(true);
                  }}
                >
                  Delete
                </PrimaryButton>
              )}
            </Box>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}

//
