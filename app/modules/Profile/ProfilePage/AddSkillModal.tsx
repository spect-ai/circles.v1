import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import { useGlobal } from "@/app/context/globalContext";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import { Credential, LensSkills, Option } from "@/app/types";
import { Box, Button, Input, Tag, Text } from "degen";
import { useEffect, useState } from "react";
import styled from "styled-components";
import LinkCredentialsModal from "./LinkCredentialsModal";
import { skills as skillsList } from "@/app/common/utils/constants";

type Props = {
  handleClose: () => void;
  modalMode: "add" | "edit";
  skills: LensSkills[];
  skillId?: number;
};

export default function AddSkillModal({
  handleClose,
  modalMode,
  skills,
  skillId,
}: Props) {
  const { userData } = useGlobal();

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

  const isEmpty = (fieldName: string, value: any) => {
    switch (fieldName) {
      case "title":
        return !value;
      case "category":
        return !value?.value;
      default:
        return false;
    }
  };

  useEffect(() => {
    setCategoryOptions(
      skillsList
        .filter((skill) => skill !== "None")
        .map((skill) => {
          return {
            label: skill,
            value: skill,
          };
        })
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
          {requiredFieldsNotSet["title"] && (
            <Text color="red" variant="small">
              This is a required field and cannot be empty
            </Text>
          )}
          <Input
            label=""
            placeholder={`Enter Skill`}
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
            <Text variant="label">Skill Category</Text>
            <Tag size="small" tone="accent">
              Required
            </Tag>
          </Box>
          {requiredFieldsNotSet["category"] && (
            <Text color="red" variant="small">
              This is a required field and cannot be empty
            </Text>
          )}
          <Dropdown
            placeholder={`Select Skill Category`}
            options={categoryOptions}
            multiple={false}
            selected={category}
            onChange={(value: any) => {
              setCategory(value);
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
              if (!title || !category?.value) {
                setRequiredFieldsNotSet({
                  ...requiredFieldsNotSet,
                  title: isEmpty("title", title),
                  category: isEmpty("category", category),
                });
                return;
              }

              let newSkills;
              if (modalMode === "add") {
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
                  return;
                }
                newSkills = skills.map((skill, index) => {
                  if (index === skillId) {
                    return {
                      title,
                      category: category?.value,
                      linkedCredentials,
                      nfts: [],
                      poaps: [],
                      icon: "",
                    };
                  }
                  return skill;
                });
              }
              const res = await updateProfile({
                skillsV2: newSkills,
              });
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
