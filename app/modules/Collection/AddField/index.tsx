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
  Option,
  PayWallOptions,
  Property,
  PropertyType,
} from "@/app/types";
import { SaveFilled } from "@ant-design/icons";
import { Box, IconTrash, Input, Stack, Text, Textarea } from "degen";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCircle } from "../../Circle/CircleContext";
import { fields } from "../Constants";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import AddOptions from "./AddOptions";
import MilestoneOptions from "./MilestoneOptions";
import uuid from "react-uuid";
import { prevPropertyTypeToNewPropertyTypeThatDoesntRequireClearance } from "@/app/common/utils/constants";
import { AnimatePresence } from "framer-motion";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import Accordian from "@/app/common/components/Accordian";
import AddConditions from "../Common/AddConditions";
import PayWall from "./PayWallOptions";
import RewardTokenOptions from "./RewardTokenOptions";
import { Field } from "../Automation/Actions/Field";

type Props = {
  propertyName?: string;
  handleClose: () => void;
};

export default function AddField({ propertyName, handleClose }: Props) {
  const {
    localCollection: collection,
    updateCollection,
    setProjectViewId,
  } = useLocalCollection();
  const { registry, circle } = useCircle();
  const [networks, setNetworks] = useState(registry);
  const [payWallOption, setPayWallOption] = useState({
    network: registry as Registry,
    value: 0,
    receiver: "",
  });
  const [initialName, setInitialName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState({ label: "Short Text", value: "shortText" });
  const [required, setRequired] = useState(0);
  const onRequiredTabClick = (id: number) => setRequired(id);
  const [defaultValue, setDefaultValue] = useState<any>();
  const [loading, setLoading] = useState(false);
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
  const [viewConditions, setViewConditions] = useState<Condition[]>(
    (propertyName && collection.properties[propertyName]?.viewConditions) || []
  );
  const [modalSize, setModalSize] = useState<"small" | "medium" | "large">(
    viewConditions?.length > 0 ? "large" : "small"
  );
  const [advancedDefaultOpen, setAdvancedDefaultOpen] = useState(
    viewConditions?.length > 0 ? true : false
  );

  const [cardOrder, setCardOrder] = useState<any>();

  const [cardRelationProps, setCardRelationProps] = useState<{
    parentRelation: string;
    childRelation: string;
  }>({
    parentRelation: "",
    childRelation: "",
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
        type: type.value,
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
      });
      if (collection.collectionType === 1) {
        res = await updateFormCollection(collection.id, {
          projectMetadata: {
            ...collection.projectMetadata,
            cardOrders: {
              ...collection.projectMetadata.cardOrders,
              [propertyName]: cardOrder,
            },
          },
        });
      }
    } else {
      res = await addField(collection.id, {
        name: name.trim(),
        type: type.value,
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
        cardRelationOptions: cardRelationProps,
      });
    }
    setLoading(false);
    if (res.id) {
      handleClose();
      updateCollection(res);
    } else {
      toast.error(res.message.toString());
    }
  };

  const updateRewardOptions = (property: Property) => {
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
  };

  useEffect(() => {
    if (
      propertyName &&
      collection.properties &&
      collection.properties[propertyName]
    ) {
      setName(propertyName);
      setInitialName(propertyName);
      // setNotifyUserType(
      //   collection.properties[propertyName].onUpdateNotifyUserTypes?.map(
      //     (type) => ({ label: type, value: type })
      //   )
      // );
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
            }}
            onCancel={() => setShowConfirmOnDelete(false)}
          />
        )}
      </AnimatePresence>
      <Modal
        title={propertyName ? "Edit Field" : "Add Field"}
        handleClose={handleClose}
        size={modalSize}
      >
        <Box padding="8">
          <Stack>
            {!["cardRelation"].includes(type.value) && (
              <Input
                label=""
                placeholder="Field Name"
                value={name}
                onChange={(e) => {
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
            )}

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
            <Textarea
              label
              hideLabel
              placeholder="Description"
              rows={2}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            {collection.collectionType === 0 && (
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
                collection.collectionType === 0
                  ? fields
                  : fields.filter((f) => f.value !== "payWall")
              }
              selected={type}
              onChange={(type) => {
                setType(type);
              }}
              multiple={false}
              isClearable={false}
            />

            {type.value === "singleSelect" ||
              (type.value === "multiSelect" && (
                <AddOptions
                  fieldOptions={fieldOptions}
                  setFieldOptions={setFieldOptions}
                  setCardOrder={setCardOrder}
                  cardOrder={cardOrder}
                />
              ))}
            {type.value === "reward" && (
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
            {type.value === "cardRelation" && (
              <Stack>
                <Input
                  label="Children Relation Property Name"
                  placeholder="Ex. Sub Cards"
                  value={cardRelationProps?.parentRelation}
                  onChange={(e) => {
                    setCardRelationProps({
                      ...cardRelationProps,
                      parentRelation: e.target.value.replace(/ /g, "_"),
                    });
                  }}
                />
                <Input
                  label="Parent Relation Property Name"
                  placeholder="Ex. Parent Card"
                  value={cardRelationProps?.childRelation}
                  onChange={(e) => {
                    setCardRelationProps({
                      ...cardRelationProps,
                      childRelation: e.target.value.replace(/ /g, "_"),
                    });
                  }}
                />
              </Stack>
            )}
            {!["cardRelation"].includes(type.value) && (
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
                  setData={setDefaultValue}
                />
              </Accordian>
            )}

            {collection.collectionType === 0 && (
              <Accordian name="Advanced" defaultOpen={advancedDefaultOpen}>
                <AddConditions
                  viewConditions={viewConditions}
                  setViewConditions={setViewConditions}
                  buttonText="Add View Condition"
                />
              </Accordian>
            )}

            <Box marginTop="8" display="flex" flexDirection="column" gap="2">
              <PrimaryButton
                icon={<SaveFilled style={{ fontSize: "1.3rem" }} />}
                loading={loading}
                // disabled={showNameCollissionError || !name}
                onClick={async () => {
                  if (
                    propertyName &&
                    !prevPropertyTypeToNewPropertyTypeThatDoesntRequireClearance[
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
