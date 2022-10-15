import Accordian from "@/app/common/components/Accordian";
import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Select from "@/app/common/components/Select";
import { addField, deleteField, updateField } from "@/app/services/Collection";
import { FormUserType, Option } from "@/app/types";
import { SaveFilled } from "@ant-design/icons";
import { Box, IconTrash, Input, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fields } from "../Constants";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import AddOptions from "./AddOptions";

type Props = {
  propertyName?: string;
  handleClose: () => void;
};

export default function AddField({ propertyName, handleClose }: Props) {
  const { localCollection: collection, setLocalCollection } =
    useLocalCollection();

  const [name, setName] = useState("");
  const [type, setType] = useState({ label: "Short Text", value: "shortText" });
  const [loading, setLoading] = useState(false);
  const [fieldOptions, setFieldOptions] = useState([
    {
      label: "Option 1",
      value: "Option 1",
    },
  ]);

  const [userType, setUserType] = useState<FormUserType>();
  const [notifyUserType, setNotifyUserType] = useState<Option[] | undefined>(
    []
  );

  const [defaultValue, setDefaultValue] = useState("");

  useEffect(() => {
    if (propertyName && collection.properties) {
      setName(propertyName);
      setNotifyUserType(
        collection.properties[propertyName].onUpdateNotifyUserTypes?.map(
          (type) => ({ label: type, value: type })
        )
      );
      const property = collection.properties[propertyName];
      setType({
        label:
          fields.find((field) => field.value === property.type)?.label || "",
        value: property.type,
      });
      if (property.type === "singleSelect" || property.type === "multiSelect") {
        setFieldOptions(property.options || []);
      }
      if (property.type === "user") {
        setUserType(property.userType);
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

          <Accordian name="Advanced Settings" defaultOpen={false}>
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
          </Accordian>

          <PrimaryButton
            icon={<SaveFilled style={{ fontSize: "1.3rem" }} />}
            loading={loading}
            onClick={async () => {
              setLoading(true);
              let res;
              if (propertyName) {
                res = await updateField(collection.id, propertyName, {
                  name,
                  type: type.value,
                  options: fieldOptions,
                  userType,
                  default: defaultValue,
                  onUpdateNotifyUserTypes: notifyUserType?.map(
                    (type) => type.value
                  ) as FormUserType[],
                  isPartOfFormView: true,
                });
              } else {
                res = await addField(collection.id, {
                  name,
                  type: type.value,
                  isPartOfFormView: false,
                  options: fieldOptions,
                  userType: userType,
                  default: defaultValue,
                  onUpdateNotifyUserTypes: notifyUserType?.map(
                    (type) => type.value
                  ) as FormUserType[],
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
