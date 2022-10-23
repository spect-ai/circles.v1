import Accordian from "@/app/common/components/Accordian";
import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Select from "@/app/common/components/Select";
import Tabs from "@/app/common/components/Tabs";
import { addField, deleteField, updateField } from "@/app/services/Collection";
import { FormUserType, Option, Registry } from "@/app/types";
import { SaveFilled } from "@ant-design/icons";
import { Box, IconTrash, Input, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCircle } from "../../Circle/CircleContext";
import { fields } from "../Constants";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import AddOptions from "./AddOptions";
import MilestoneOptions from "./MilestoneOptions";
import RewardOptions from "./RewardOptions";
import uuid from "react-uuid";

type Props = {
  propertyName?: string;
  handleClose: () => void;
};

export default function AddField({ propertyName, handleClose }: Props) {
  const { localCollection: collection, setLocalCollection } =
    useLocalCollection();
  const { registry } = useCircle();
  const [networks, setNetworks] = useState(registry);
  const [selectedRewardOptions, setSelectedRewardOptions] = useState(registry);

  const [name, setName] = useState("");
  const [type, setType] = useState({ label: "Short Text", value: "shortText" });
  const [required, setRequired] = useState(0);
  const onRequiredTabClick = (id: number) => setRequired(id);

  const [loading, setLoading] = useState(false);
  const [fieldOptions, setFieldOptions] = useState([
    {
      label: "Option 1",
      value: `option-${uuid()}`,
    },
  ]);

  const [userType, setUserType] = useState<FormUserType>();
  const [notifyUserType, setNotifyUserType] = useState<Option[] | undefined>(
    []
  );

  const [defaultValue, setDefaultValue] = useState("");

  useEffect(() => {
    if (
      propertyName &&
      collection.properties &&
      collection.properties[propertyName]
    ) {
      setName(propertyName);
      // setNotifyUserType(
      //   collection.properties[propertyName].onUpdateNotifyUserTypes?.map(
      //     (type) => ({ label: type, value: type })
      //   )
      // );
      const property = collection.properties[propertyName];
      setRequired(property?.required ? 1 : 0);

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
        setNetworks(property.rewardOptions);
      }
    }
  }, [collection.properties, propertyName]);

  return (
    <Modal
      title={propertyName ? "Edit Field" : "Add Field"}
      handleClose={handleClose}
      size="small"
    >
      <Box padding="8">
        <Stack>
          <Input
            label=""
            placeholder="Field Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Dropdown
            options={fields}
            selected={type}
            onChange={(type) => {
              setType(type);
            }}
            multiple={false}
            isClearable={false}
          />
          <Tabs
            selectedTab={required}
            onTabClick={onRequiredTabClick}
            tabs={["Optional", "Required"]}
            orientation="horizontal"
            unselectedColor="transparent"
          />
          {type.value === "singleSelect" || type.value === "multiSelect" ? (
            <AddOptions
              fieldOptions={fieldOptions}
              setFieldOptions={setFieldOptions}
            />
          ) : null}
          {type.value === "user" || type.value === "user[]" ? (
            <Stack>
              <Text variant="label">User Type</Text>
              <Select
                options={[
                  { label: "Assignee", value: "assignee" },
                  { label: "Reviewer", value: "reviewer" },
                  { label: "Grantee", value: "grantee" },
                  { label: "Applicant", value: "applicant" },
                  { label: "None", value: "none" },
                ]}
                value={{
                  label: userType as string,
                  value: userType as string,
                }}
                onChange={(type) => {
                  setUserType(type.value as FormUserType);
                }}
              />
            </Stack>
          ) : null}
          {type.value === "reward" ? (
            <RewardOptions networks={networks} setNetworks={setNetworks} />
          ) : null}
          {type.value === "milestone" ? (
            <MilestoneOptions networks={networks} setNetworks={setNetworks} />
          ) : null}
          {/* <Accordian name="Advanced Settings" defaultOpen={false}>
            <Stack space="2">
              {["shortText", "longText", "ethAddress"].includes(type.value) && (
                <Input label="" placeholder="Default Value" />
              )}

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
              />
            </Stack>
          </Accordian> */}

          <PrimaryButton
            icon={<SaveFilled style={{ fontSize: "1.3rem" }} />}
            loading={loading}
            onClick={async () => {
              setLoading(true);
              let res;
              let rewardOptions = {} as Registry | undefined;
              if (type.value === "reward" || type.value === "milestone") {
                rewardOptions = networks;
              }
              let milestoneFields = [] as string[];
              if (type.value === "milestone") {
                milestoneFields = ["name", "description", "dueDate", "reward"];
              }
              console.log({ rewardOptions });
              if (propertyName) {
                res = await updateField(collection.id, propertyName, {
                  name,
                  type: type.value,
                  options: fieldOptions,
                  rewardOptions,
                  userType,
                  default: defaultValue,
                  onUpdateNotifyUserTypes: notifyUserType?.map(
                    (type) => type.value
                  ) as FormUserType[],
                  isPartOfFormView: true,
                  required: required === 1,
                  milestoneFields,
                });
              } else {
                res = await addField(collection.id, {
                  name,
                  type: type.value,
                  isPartOfFormView: false,
                  options: fieldOptions,
                  rewardOptions,
                  userType: userType,
                  default: defaultValue,
                  onUpdateNotifyUserTypes: notifyUserType?.map(
                    (type) => type.value
                  ) as FormUserType[],
                  required: required === 1,
                  milestoneFields,
                });
              }
              setLoading(false);
              if (res.id) {
                console.log({ res });
                handleClose();

                setLocalCollection(res);
              } else {
                toast.error(res.message);
              }
              console.log({ res });
            }}
          >
            Save
          </PrimaryButton>
          {propertyName && (
            <PrimaryButton
              tone="red"
              icon={<IconTrash />}
              onClick={async () => {
                const res = await deleteField(collection.id, propertyName);
                console.log({ res });
                if (res.id) {
                  handleClose();
                  setLocalCollection(res);
                } else {
                  toast.error(res.message);
                }
              }}
            >
              Delete
            </PrimaryButton>
          )}
        </Stack>
      </Box>
    </Modal>
  );
}
