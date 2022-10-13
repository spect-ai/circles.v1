import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Select from "@/app/common/components/Select";
import { addField, updateField } from "@/app/services/Collection";
import { FormUserType } from "@/app/types";
import { Box, Input, Stack, Text } from "degen";
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
  const [notifyUserType, setNotifyUserType] = useState<FormUserType[]>([]);

  useEffect(() => {
    if (propertyName) {
      setName(propertyName);
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
        setNotifyUserType(property.onUpdateNotifyUserTypes as FormUserType[]);
      }
    }
  }, [collection.properties, propertyName]);

  return (
    <Modal title="Add Field" handleClose={handleClose} size="small">
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

          <PrimaryButton
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
                  onUpdateNotifyUserTypes: notifyUserType,
                  isPartOfFormView: true,
                });
              } else {
                res = await addField(collection.id, {
                  name,
                  type: type.value,
                  isPartOfFormView: false,
                  options: fieldOptions,
                  userType: userType,
                  onUpdateNotifyUserTypes: notifyUserType,
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
        </Stack>
      </Box>
    </Modal>
  );
}
