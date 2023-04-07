import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import { Credential, LensSkills, Option, PoapCredential } from "@/app/types";
import { Box, Button, Input, Tag, Text } from "degen";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { skills as skillsList } from "@/app/common/utils/constants";
import { useAtom } from "jotai";
import { userDataAtom } from "@/app/state/global";
import LinkCredentialsModal from "./LinkCredentialsModal";

type Props = {
  handleClose: () => void;
  modalMode: "add" | "edit";
  skills: LensSkills[];
  allCredentials: {
    poaps: PoapCredential[];
    kudos: Credential[];
    gitcoinPassports: Credential[];
  };
  skillId?: number;
};

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

const AddSkillModal = ({
  handleClose,
  modalMode,
  skills,
  allCredentials,
  skillId,
}: Props) => {
  const [userData] = useAtom(userDataAtom);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState({} as Option);
  const [categoryOptions, setCategoryOptions] = useState([] as Option[]);

  const [linkedCredentials, setLinkedCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useProfileUpdate();

  const [requiredFieldsNotSet, setRequiredFieldsNotSet] = useState({
    title: false,
    category: false,
  });

  const isEmpty = (
    fieldName: string,
    value:
      | {
          value: string;
          label: string;
        }
      | string
  ) => {
    switch (fieldName) {
      case "title":
        return !value;
      case "category":
        if (typeof value !== "string") {
          return !value.value;
        }
        return !value;
      default:
        return false;
    }
  };

  useEffect(() => {
    setCategoryOptions(
      skillsList
        .filter((skill) => skill !== "None")
        .map((skill) => ({
          label: skill,
          value: skill,
        }))
    );
    if (modalMode === "edit" && (skillId || skillId === 0)) {
      setLoading(true);
      const skill = userData.skillsV2[skillId];
      setTitle(skill?.title);
      setLinkedCredentials(skill?.linkedCredentials);
      setCategory({
        label: skill?.category,
        value: skill?.category,
      });
      setLoading(false);
    }
  }, []);

  useEffect(() => {}, []);

  return (
    <Modal
      handleClose={() => {
        handleClose();
      }}
      title={modalMode === "add" ? "Add Skill" : "Edit Skill"}
    >
      <Box
        padding={{
          xs: "2",
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
            <Text variant="label">Skill</Text>
            <Tag size="small" tone="accent">
              Required
            </Tag>
          </Box>
          {requiredFieldsNotSet.title && (
            <Text color="red" variant="small">
              This is a required field and cannot be empty
            </Text>
          )}
          <Input
            label
            placeholder="Enter Skill"
            value={title}
            maxLength={50}
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
            <Text variant="label">Skill Category</Text>
            <Tag size="small" tone="accent">
              Required
            </Tag>
          </Box>
          {requiredFieldsNotSet.category && (
            <Text color="red" variant="small">
              This is a required field and cannot be empty
            </Text>
          )}
          <Dropdown
            placeholder="Select Skill Category"
            options={categoryOptions}
            multiple={false}
            selected={category}
            onChange={(
              value:
                | {
                    value: string;
                    label: string;
                  }
                | string
            ) => {
              if (typeof value !== "string") {
                setCategory(value);
              }
              setRequiredFieldsNotSet({
                ...requiredFieldsNotSet,
                category: isEmpty("category", value),
              });
            }}
            portal
          />
        </Box>
        <Box>
          <Text variant="label">Credentials</Text>
          <LinkCredentialsModal
            credentials={linkedCredentials}
            setCredentials={setLinkedCredentials}
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
            // @ts-ignore
            marginRight="2"
            variant="secondary"
            size="small"
            width="32"
            loading={loading}
            onClick={async () => {
              setLoading(true);
              if (!title || !category?.value) {
                setRequiredFieldsNotSet({
                  ...requiredFieldsNotSet,
                  title: isEmpty("title", title),
                  category: isEmpty("category", category),
                });
                setLoading(false);

                return;
              }

              let newSkills;
              if (modalMode === "add") {
                if (!skills) {
                  // eslint-disable-next-line no-param-reassign
                  skills = [];
                }
                newSkills = [
                  ...skills,
                  {
                    title,
                    category: category?.value,
                    linkedCredentials,
                    nfts: [],
                    poaps: [],
                    icon: "",
                  },
                ];
              } else if (modalMode === "edit") {
                if (!skillId && skillId !== 0) {
                  setLoading(false);
                  return;
                }
                newSkills = skills.map((skill, index) => {
                  if (index === skillId) {
                    setLoading(false);

                    return {
                      title,
                      category: category?.value,
                      linkedCredentials,
                      nfts: [],
                      poaps: [],
                      icon: "",
                    };
                  }
                  setLoading(false);

                  return skill;
                });
              }
              await updateProfile({
                skillsV2: newSkills,
              });
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
};

AddSkillModal.defaultProps = {
  skillId: null,
};

export default AddSkillModal;
