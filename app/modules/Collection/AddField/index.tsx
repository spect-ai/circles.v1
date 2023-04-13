/* eslint-disable @typescript-eslint/no-explicit-any */
import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Tabs from "@/app/common/components/Tabs";
import {
  addField,
  deleteField,
  updateField,
  updateFormCollection,
} from "@/app/services/Collection";
import {
  CollectionType,
  Condition,
  FormUserType,
  Registry,
  PayWallOptions,
  Property,
  PropertyType,
} from "@/app/types";
import { SaveFilled } from "@ant-design/icons";
import { Box, IconTrash, Input, Stack, Text } from "degen";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCircle } from "../../Circle/CircleContext";
import { fieldOptionsDropdown, fields } from "../Constants";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import AddOptions from "./AddOptions";
import MilestoneOptions from "./MilestoneOptions";
import uuid from "react-uuid";
import { prevPropertyTypeToNewPropertyTypeThatDoesntRequiresClarance } from "@/app/common/utils/constants";
import { AnimatePresence } from "framer-motion";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import Accordian from "@/app/common/components/Accordian";
import AddConditions from "../Common/AddConditions";
import PayWall from "./PayWallOptions";
import RewardTokenOptions from "./RewardTokenOptions";
import { useKeyPressEvent } from "react-use";
import Editor from "@/app/common/components/Editor";

type Props = {
  propertyName?: string;
  pageId?: string;
  handleClose: () => void;
};

export default function AddField({ propertyName, pageId, handleClose }: Props) {
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

  const [viewConditions, setViewConditions] = useState<Condition[]>(
    (propertyName && collection.properties[propertyName]?.viewConditions) || []
  );
  const [modalSize, setModalSize] = useState<"small" | "medium" | "large">(
    viewConditions?.length > 0 ? "large" : "small"
  );
  const [advancedDefaultOpen, setAdvancedDefaultOpen] = useState(
    viewConditions?.length > 0 ? true : false
  );
  const [reasonFieldNeedsUserAttention, setReasonFieldNeedsUserAttention] =
    useState(propertyName ? reasonFieldNeedsAttention[propertyName] : "");

  const [cardOrder, setCardOrder] = useState<any>();
  const [maxSelections, setMaxSelections] = useState<number>();
  const [allowCustom, setAllowCustom] = useState(false);

  const [isDirty, setIsDirty] = useState(false);

  const onRequiredTabClick = (id: number) => {
    setIsDirty(true);
    setRequired(id);
  };

  useKeyPressEvent("Enter", () => {
    // check if no input is focused
    if (!document.activeElement?.className.includes("ProseMirror")) {
      if (name.trim() !== "" && !loading && !showNameCollissionError) {
        if (
          propertyName &&
          !prevPropertyTypeToNewPropertyTypeThatDoesntRequiresClarance[
            collection.properties[propertyName].type
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
    setLoading(true);
    let res;
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
    if (propertyName) {
      res = await updateField(collection.id, propertyName, {
        name: name.trim(),
        type: type.value as PropertyType,
        options: fieldOptions,
        rewardOptions,
        description,
        userType,
        default: defaultValue,
        isPartOfFormView: collection.properties[propertyName]?.isPartOfFormView,
        required: required === 1,
        milestoneFields,
        viewConditions,
        payWallOptions,
        maxSelections,
        allowCustom,
      });
      if (collection.collectionType === 1) {
        res = await updateFormCollection(collection.id, {
          projectMetadata: {
            ...res.projectMetadata,
            cardOrders: {
              ...res.projectMetadata.cardOrders,
              [name.trim()]: cardOrder,
            },
          },
        });
      }
    } else {
      if (!pageId && collection.collectionType === 0) {
        toast.error("Pageid is missing, try again");
        return;
      }
      res = await addField(
        collection.id,
        {
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
          viewConditions,
          payWallOptions,
          maxSelections,
          allowCustom,
        },
        pageId
      );
    }
    setIsDirty(false);
    setLoading(false);
    if (res.id) {
      handleClose();
      updateCollection(res);
    } else {
      toast.error(res.message.toString());
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
      propertyName &&
      collection.properties &&
      collection.properties[propertyName]
    ) {
      setName(propertyName);
      setInitialName(propertyName);
      const property = collection.properties[propertyName];
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
        setFieldOptions(property?.options || []);
        setMaxSelections(property?.maxSelections);
        setAllowCustom(Boolean(property?.allowCustom));
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
    }
  }, [collection.properties, propertyName]);

  useEffect(() => {
    if (type.value === "reward" || type.value === "milestone") {
      const property = collection?.properties[name];

      updateRewardOptions(property);
    }
  }, [type]);

  useEffect(() => {
    setModalSize(viewConditions?.length > 0 ? "large" : "small");
    setAdvancedDefaultOpen(viewConditions?.length > 0 ? true : false);
  }, [viewConditions]);

  useEffect(() => {
    if (propertyName && collection.projectMetadata?.cardOrders) {
      setCardOrder(collection.projectMetadata.cardOrders[propertyName]);
    }
  }, [collection.projectMetadata?.cardOrders, propertyName]);

  useEffect(() => {
    if (viewConditions) {
      const res = getIfFieldNeedsAttention({
        name: name.trim(),
        type: type.value as PropertyType,
        isPartOfFormView: false,
        description,
        options: fieldOptions,
        userType: userType,
        default: defaultValue,
        required: required === 1,
        viewConditions,
        maxSelections,
        allowCustom,
      });
      setReasonFieldNeedsUserAttention(res?.reason);
    }
  }, [viewConditions]);

  return (
    <Box>
      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal
            title="This will remove existing data associated with this field as the field type is changed. Are you sure you want to continue?"
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
                (propertyName as string).trim()
              );
              if (res.id) {
                res.collectionType === 1 &&
                  setProjectViewId(res.projectMetadata.viewOrder[0]);
                handleClose();
                updateCollection(res);
              } else {
                toast.error("Error deleting field");
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
        title={propertyName ? "Edit Field" : "Add Field"}
        handleClose={() => {
          if (isDirty) {
            setShowConfirmOnClose(true);
          } else {
            handleClose();
          }
        }}
        size={modalSize}
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
            {collection.collectionType === 0 && (
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
              options={fieldOptionsDropdown}
              selected={type}
              onChange={(type) => {
                setIsDirty(true);
                setType(type);
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
                multiSelect={type.value === "multiSelect"}
                setIsDirty={setIsDirty}
              />
            ) : null}
            {type.value === "reward" && collection.collectionType === 0 && (
              <RewardTokenOptions
                networks={networks}
                setNetworks={setNetworks}
              />
            )}
            {type.value === "milestone" && (
              <MilestoneOptions networks={networks} setNetworks={setNetworks} />
            )}
            {type.value === "payWall" && (
              <PayWall
                payWallOption={payWallOption}
                setPayWallOption={setPayWallOption}
              />
            )}
            {/* {!["discord", "github", "twitter", "telegram", "wallet"].includes(
              type.value
            ) && (
              <Accordian name="Default Value" defaultOpen={false}>
                <Field
                  collection={collection}
                  property={{
                    name: name.trim(),
                    options: fieldOptions,
                    rewardOptions: networks,
                    userType: userType,
                    default: defaultValue,
                    type: type.value as PropertyType,
                    isPartOfFormView: true,
                  }}
                  type={type.value}
                  data={defaultValue}
                  setData={(data) => {
                    setIsDirty(true);
                    setDefaultValue(data);
                  }}
                />
              </Accordian>
            )} */}

            {collection.collectionType === 0 && (
              <Accordian name="Advanced" defaultOpen={advancedDefaultOpen}>
                <AddConditions
                  viewConditions={viewConditions}
                  setViewConditions={(conditions) => {
                    setIsDirty(true);
                    setViewConditions(conditions);
                  }}
                  buttonText="Add Condition when Field is Visible"
                  collection={collection}
                  buttonWidth="fit"
                  dropDownPortal={true}
                />
                {/* {["shortText", "longText", "ethAddress"].includes(
                  type.value
                ) && <Input label="" placeholder="Default Value" />}

                <Text>Notify User Type on Changes</Text>
                <Dropdown
                  placeholder="Select User Types"
                  options={[
                    { label: "Assignee", value: "assignee" },
                    { label: "Reviewer", value: "reviewer" },
                    { label: "Grantee", value: "grantee" },
                    { label: "Applicant", value: "applicant" },
                  ]}
                  selected={notifyUserType}
                  onChange={(type: Option[]) => {
                    setNotifyUserType(type);
                  }}
                  multiple={true}
                /> */}
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
                    propertyName &&
                    !prevPropertyTypeToNewPropertyTypeThatDoesntRequiresClarance[
                      collection.properties[propertyName].type
                    ].includes(type.value)
                  ) {
                    setShowConfirm(true);
                  } else {
                    await onSave();
                  }
                }}
              >
                Save
              </PrimaryButton>
              {propertyName && (
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
