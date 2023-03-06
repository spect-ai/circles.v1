import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import CheckBox from "@/app/common/components/Table/Checkbox";

import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import { userDataAtom } from "@/app/state/global";
import { Credential } from "@/app/types";
import { Box, Button, Input, Tag, Text, useTheme } from "degen";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import styled from "styled-components";
import LinkCredentialsModal from "./LinkCredentialsModal";

type Props = {
  handleClose: () => void;
  modalMode: "add" | "edit";
  educationId?: number;
};

export default function AddEducationModal({
  handleClose,
  modalMode,
  educationId,
}: Props) {
  const [userData] = useAtom<any>(userDataAtom);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(
    educationId ? userData.education[educationId]?.description : ""
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [organization, setOrganization] = useState("");
  const [linkedCredentials, setLinkedCredentials] = useState<Credential[]>([]);
  const [currentlyStudying, setCurrentlyStudying] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    addEducation: createEducation,
    updateEducation,
    preprocessDate,
  } = useProfileUpdate();

  const [requiredFieldsNotSet, setRequiredFieldsNotSet] = useState({
    title: false,
    organization: false,
    startDate: false,
  });
  const [dateError, setDateError] = useState(false);

  const { mode } = useTheme();

  const isEmpty = (fieldName: string, value: any) => {
    switch (fieldName) {
      case "title":
      case "organization":
      case "startDate":
        return !value;
      default:
        return false;
    }
  };

  const dateIsInvalidValid = (startDate: string, endDate: string) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return start > end;
    }
    return false;
  };

  useEffect(() => {
    if (modalMode === "edit" && (educationId || educationId === 0)) {
      setLoading(true);
      const education = userData.education[educationId];
      console.log({ education });
      setTitle(education.courseDegree);
      setOrganization(education.school);
      setDescription(education.description);
      setCurrentlyStudying(education.currentlyStudying);

      setStartDate(
        education.start_date?.year?.toString().padStart(2, "0") +
          "-" +
          education.start_date?.month?.toString().padStart(2, "0") +
          "-" +
          education.start_date?.day?.toString().padStart(2, "0")
      );
      setEndDate(
        education.end_date?.year?.toString().padStart(2, "0") +
          "-" +
          education.end_date?.month?.toString().padStart(2, "0") +
          "-" +
          education.end_date?.day?.toString().padStart(2, "0")
      );
      setLinkedCredentials(education.linkedCredentials);
      setLoading(false);
    }
  }, []);

  return (
    <Modal
      handleClose={() => {
        handleClose();
      }}
      title={modalMode === "add" ? "Add Education" : "Edit Education"}
    >
      <Box
        padding={{
          xs: "4",
          md: "8",
        }}
        width="full"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        gap="4"
      >
        <Box>
          <Box display="flex" flexDirection="row" alignItems="center" gap="2">
            <Text variant="label">Degree or Name of Qualification</Text>
            <Tag size="small" tone="accent">
              Required
            </Tag>
          </Box>
          {requiredFieldsNotSet["title"] && (
            <Text color="red" variant="small">
              This is a required field and cannot be empty
            </Text>
          )}
          <Input
            label=""
            placeholder={`Enter Title`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setRequiredFieldsNotSet({
                ...requiredFieldsNotSet,
                title: isEmpty("title", e.target.value),
              });
            }}
          />
        </Box>
        <Box>
          <Box display="flex" flexDirection="row" alignItems="center" gap="2">
            <Text variant="label">School or Issuing Organization</Text>
            <Tag size="small" tone="accent">
              Required
            </Tag>
          </Box>
          {requiredFieldsNotSet["organization"] && (
            <Text color="red" variant="small">
              This is a required field and cannot be empty
            </Text>
          )}
          <Input
            label=""
            placeholder={`Enter Organization`}
            value={organization}
            onChange={(e) => {
              setOrganization(e.target.value);
              setRequiredFieldsNotSet({
                ...requiredFieldsNotSet,
                organization: isEmpty("organization", e.target.value),
              });
            }}
          />
        </Box>

        <Box>
          <Text variant="label">Description</Text>

          <Box
            marginTop="2"
            width="full"
            borderWidth="0.375"
            padding="4"
            borderRadius="large"
            maxHeight="64"
            overflow="auto"
          >
            <Editor
              value={description}
              onSave={(value) => {
                setDescription(value);
              }}
              placeholder={`Enter Description, press / for commands`}
              isDirty={true}
            />
          </Box>
        </Box>
        <Box>
          <Box
            display="flex"
            flexDirection={{
              xs: "column",
              md: "row",
            }}
            gap={{
              xs: "0",
              md: "4",
            }}
          >
            <Box
              width={{
                xs: "full",
                md: "96",
              }}
            >
              <Text variant="label">Start Date</Text>

              <DateInput
                placeholder={`Enter Start Date`}
                value={startDate}
                type="date"
                mode={mode}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setDateError(dateIsInvalidValid(e.target.value, endDate));
                }}
              />
            </Box>
            <Box
              width={{
                xs: "full",
                md: "96",
              }}
              marginTop={{
                xs: "2",
                md: "0",
              }}
            >
              <Text variant="label">End Date</Text>

              <DateInput
                placeholder={`Enter End Date`}
                value={endDate}
                type="date"
                mode={mode}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentlyStudying(false);
                  setDateError(dateIsInvalidValid(startDate, e.target.value));
                }}
              />
            </Box>
          </Box>
          {dateError && (
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap="2"
              marginTop="1"
            >
              <Text color="red">
                Please make sure start date is before end date
              </Text>
            </Box>
          )}
          <Box
            width="full"
            marginTop="2"
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="2"
            justifyContent="flex-end"
          >
            <Text variant="label">Currently actively learning</Text>

            <CheckBox
              isChecked={currentlyStudying}
              onClick={() => {
                setCurrentlyStudying(!currentlyStudying);
                setEndDate("");
                setDateError(false);
              }}
            />
          </Box>
        </Box>
        <Box>
          <Text variant="label">Credentials</Text>
          <LinkCredentialsModal
            credentials={linkedCredentials}
            setCredentials={setLinkedCredentials}
          />
        </Box>
        <Box
          marginTop={{
            xs: "0",
            md: "4",
          }}
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
        >
          <Button
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            marginRight="2"
            variant="secondary"
            size="small"
            width="32"
            onClick={async () => {
              console.log({ title, organization });
              if (!title || !organization) {
                setRequiredFieldsNotSet({
                  ...requiredFieldsNotSet,
                  title: isEmpty("title", title),
                  organization: isEmpty("organization", organization),
                });
                return;
              }
              const dateIsInvalid = dateIsInvalidValid(startDate, endDate);
              if (dateIsInvalid) {
                setDateError(true);
                return;
              }
              if (modalMode === "add") {
                const res = await createEducation({
                  courseDegree: title,
                  school: organization,
                  schoolLogo: "",
                  description,
                  start_date: preprocessDate(startDate),
                  end_date: preprocessDate(endDate),
                  currentlyStudying,
                  linkedCredentials,
                });
              } else if (modalMode === "edit") {
                if (!educationId && educationId !== 0) {
                  return;
                }
                const res = await updateEducation(educationId?.toString(), {
                  courseDegree: title,
                  school: organization,
                  schoolLogo: "",
                  description,
                  start_date: preprocessDate(startDate),
                  end_date: preprocessDate(endDate),
                  currentlyStudying,
                  linkedCredentials,
                });
              }
              handleClose();
            }}
          >
            {modalMode === "add" ? "Add" : "Update"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
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
