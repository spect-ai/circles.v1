import PrimaryButton from "@/app/common/components/PrimaryButton";
import { LensSkills, UserType } from "@/app/types";
import { Box, Text, useTheme } from "degen";
import router from "next/router";
import { memo, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import AddSkillModal from "../AddSkillModal";
import ViewSkillModal from "../ViewSkillModal";

const Skills = ({ userData }: { userData: UserType }) => {
  const { mode } = useTheme();
  const [openSkillModal, setOpenSkillModal] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<number>(0);
  const [openSkillView, setOpenSkillView] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const skills = userData.skillsV2;

  return (
    <Box width="full">
      {openSkillView && (
        <ViewSkillModal
          skillId={selectedSkillId}
          handleClose={() => setOpenSkillView(false)}
          setEditSkill={(value) => {
            if (value) {
              setModalMode("edit");
              setOpenSkillModal(value);
            }
          }}
        />
      )}
      {openSkillModal && (
        <AddSkillModal
          modalMode={modalMode}
          skills={skills}
          handleClose={() => setOpenSkillModal(false)}
          skillId={selectedSkillId}
        />
      )}
      {!skills?.length && (
        <Box style={{ margin: "35vh 15vw" }}>
          <Text color="accent" align="center">
            You havent added your skills yet :/
          </Text>
          {currentUser?.id === userData.id && (
            <Box marginTop="4">
              <PrimaryButton
                variant="tertiary"
                onClick={() => setOpenSkillModal(true)}
              >
                Add Skill
              </PrimaryButton>
            </Box>
          )}
        </Box>
      )}
      {skills?.length && (
        <>
          {currentUser?.id === userData.id && (
            <Box width="48" marginTop="4">
              <PrimaryButton onClick={() => setOpenSkillModal(true)}>
                Add Skill
              </PrimaryButton>
            </Box>
          )}
          <InfoBox>
            {skills.map((skill: LensSkills, index) => {
              return (
                <SkillTag
                  key={index}
                  mode={mode}
                  onClick={() => {
                    setSelectedSkillId(index);
                    setOpenSkillView(true);
                  }}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text variant="extraLarge" weight="semiBold">
                      {skill.title}
                    </Text>
                    {skill.linkedCredentials?.length > 0 && (
                      <Text variant="label">
                        {skill.linkedCredentials?.length} Credentials Linked
                      </Text>
                    )}
                  </Box>
                </SkillTag>
              );
            })}{" "}
          </InfoBox>
        </>
      )}
    </Box>
  );
};

export default memo(Skills);

export const SkillTag = styled(Box)<{ mode: string }>`
  border-radius: 1.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
    cursor: pointer;
  }
  transition: all 0.3s ease-in-out;
  padding: 0.1rem 1.5rem;
  justify-content: center;
  align-items: center;
`;

const InfoBox = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-top: 1rem;
  justify-content: flex-start;
`;
