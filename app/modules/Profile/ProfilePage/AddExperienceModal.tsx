import Dropdown from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import { Milestone, Option, Registry, VerifiableCredential } from "@/app/types";
import { Box, Button, Input, Stack, Tag, Text, useTheme } from "degen";
import { useEffect, useState } from "react";
import styled from "styled-components";
import LinkCredentialsModal from "./LinkCredentialsModal";
import { Credential } from "@/app/types";
import CheckBox from "@/app/common/components/Table/Checkbox";
import { useAtom } from "jotai";
import { userDataAtom } from "@/app/state/global";

type Props = {
  handleClose: () => void;
  modalMode: "add" | "edit";
  allCredentials: { [id: string]: any[] };
  experienceId?: number;
};

export default function AddExperienceModal({
  handleClose,
  modalMode,
  allCredentials,
  experienceId,
}: Props) {
  const [userData, setUserData] = useAtom(userDataAtom);

  const [role, setRole] = useState("");
  const [description, setDescription] = useState(
    experienceId || experienceId === 0
      ? userData.experiences[experienceId]?.description
      : ""
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [organization, setOrganization] = useState("");
  const [linkedCredentials, setLinkedCredentials] = useState<Credential[]>([]);
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    addExperience: createExperience,
    updateExperience,
    preprocessDate,
  } = useProfileUpdate();

  const [requiredFieldsNotSet, setRequiredFieldsNotSet] = useState({
    role: false,
    organization: false,
    startDate: false,
  });
  const [dateError, setDateError] = useState(false);

  const { mode } = useTheme();

  const isEmpty = (fieldName: string, value: any) => {
    switch (fieldName) {
      case "role":
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
    if (modalMode === "edit" && (experienceId || experienceId === 0)) {
      setLoading(true);
      const experience = userData.experiences[experienceId];
      setRole(experience.jobTitle);
      setOrganization(experience.company);
      setCurrentlyWorking(experience.currentlyWorking);
      if (
        experience.start_date?.year &&
        experience.start_date?.month &&
        experience.start_date?.day
      ) {
        setStartDate(
          experience.start_date?.year?.toString().padStart(2, "0") +
            "-" +
            experience.start_date?.month?.toString().padStart(2, "0") +
            "-" +
            experience.start_date?.day?.toString().padStart(2, "0")
        );
      }
      if (
        experience.end_date?.year &&
        experience.end_date?.month &&
        experience.end_date?.day
      ) {
        setEndDate(
          experience.end_date?.year?.toString().padStart(2, "0") +
            "-" +
            experience.end_date?.month?.toString().padStart(2, "0") +
            "-" +
            experience.end_date?.day?.toString().padStart(2, "0")
        );
      }
      console.log({ experience });
      setLinkedCredentials(experience.linkedCredentials);
      setLoading(false);
    }
  }, []);

  return (
    <Modal
      handleClose={() => {
        handleClose();
      }}
      title={modalMode === "add" ? "Add Experience" : "Edit Experience"}
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
            <Text variant="label">Role</Text>
            <Tag size="small" tone="accent">
              Required
            </Tag>
          </Box>
          {requiredFieldsNotSet["role"] && (
            <Text color="red" variant="small">
              This is a required field and cannot be empty
            </Text>
          )}
          <Input
            label=""
            placeholder={`Enter Role`}
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setRequiredFieldsNotSet({
                ...requiredFieldsNotSet,
                role: isEmpty("role", e.target.value),
              });
            }}
          />
        </Box>
        <Box>
          <Box display="flex" flexDirection="row" alignItems="center" gap="2">
            <Text variant="label">Organization</Text>
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
                  setCurrentlyWorking(false);
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
            <Text variant="label">Currently working here</Text>

            <CheckBox
              isChecked={currentlyWorking}
              onClick={() => {
                setCurrentlyWorking(!currentlyWorking);
                setEndDate("");
                setDateError(false);
              }}
            />
          </Box>
        </Box>
        <Box>
          <Text variant="label">Credentials</Text>
          <LinkCredentialsModal
            setCredentials={setLinkedCredentials}
            credentials={linkedCredentials}
            allCredentials={allCredentials}
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
            disabled={dateError}
            loading={loading}
            onClick={async () => {
              setLoading(true);
              if (!role || !organization) {
                setRequiredFieldsNotSet({
                  ...requiredFieldsNotSet,
                  role: isEmpty("role", role),
                  organization: isEmpty("organization", organization),
                });
                setLoading(false);

                return;
              }
              const dateIsInvalid = dateIsInvalidValid(startDate, endDate);
              if (dateIsInvalid) {
                setDateError(true);
                setLoading(false);

                return;
              }
              if (modalMode === "add") {
                console.log("add");
                const res = await createExperience({
                  jobTitle: role,
                  company: organization,
                  companyLogo: "",
                  description,
                  start_date: preprocessDate(startDate),
                  end_date: preprocessDate(endDate),
                  currentlyWorking,
                  linkedCredentials: linkedCredentials,
                });
              } else if (modalMode === "edit") {
                if (!experienceId && experienceId !== 0) {
                  setLoading(false);

                  return;
                }
                const res = await updateExperience(experienceId?.toString(), {
                  jobTitle: role,
                  company: organization,
                  companyLogo: "",
                  description,
                  start_date: preprocessDate(startDate),
                  end_date: preprocessDate(endDate),
                  currentlyWorking,
                  linkedCredentials: linkedCredentials,
                });
              }
              setLoading(false);
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
  outline: none;
  &:focus {
    border-color: rgb(191, 90, 242, 1);
  }
  transition: border-color 0.5s ease;
`;
