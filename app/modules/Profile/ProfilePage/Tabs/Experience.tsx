import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  Credential,
  LensDate,
  LensExperience,
  PoapCredential,
  UserType,
} from "@/app/types";
import { Box, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import { memo, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import AddExperienceModal from "../AddExperienceModal";
import LensImportModal from "../LensImportModal";
import ViewExperienceModal from "../ViewExperienceModal";

const Card = styled(Box)<{ mode: string }>`
  display: flex;
  flex-direction: column;
  min-height: 12vh;
  margin-top: 1rem;
  padding: 0.4rem 1rem 0;
  border-radius: 0.5rem;
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
  position: relative;
  transition: all 0.3s ease-in-out;
  width: 80%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ScrollContainer = styled(Box)`
  @media (max-width: 768px) {
    width: 100%;
    padding: 0;
    margin: 0;
    padding-right: 1.2rem;
  }
  @media (max-width: 1028px) and (min-width: 768px) {
    width: 100%;
  }
  overflow: auto;
  width: 50vw;
  height: 80vh;
  padding-right: 2rem;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Experience = ({
  userData,
  allCredentials,
}: {
  userData: UserType;
  allCredentials: {
    poaps: PoapCredential[];
    kudos: Credential[];
    gitcoinPassports: Credential[];
  };
}) => {
  const { mode } = useTheme();
  const [addExperience, setAddExperience] = useState(false);
  const [addFromLens, setAddFromLens] = useState(false);
  const [selectedExperienceId, setSelectedExperienceId] = useState<number>();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [openExperienceView, setOpenExperienceView] = useState(false);
  const { experiences } = userData;

  const dateExists = (date: LensDate) => date.day && date.month && date.year;

  return (
    <Box width="full">
      {addFromLens && (
        <LensImportModal handleClose={() => setAddFromLens(false)} />
      )}
      <AnimatePresence>
        {addExperience && (
          <AddExperienceModal
            modalMode={modalMode}
            experienceId={selectedExperienceId}
            handleClose={() => setAddExperience(false)}
            allCredentials={allCredentials}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openExperienceView && (
          <ViewExperienceModal
            experienceId={selectedExperienceId}
            handleClose={() => setOpenExperienceView(false)}
            setEditExperience={(value) => {
              if (value) {
                setModalMode("edit");
                setAddExperience(true);
              }
            }}
          />
        )}
      </AnimatePresence>

      <ScrollContainer>
        {!experiences?.length && (
          <Box style={{ margin: "35vh 15vw" }}>
            <Text color="accent" align="center">
              No experience added yet
            </Text>
            {currentUser?.id === userData.id && (
              <Box marginTop="4">
                <PrimaryButton
                  variant="tertiary"
                  onClick={() => {
                    setModalMode("add");
                    setAddExperience(true);
                  }}
                >
                  Add Experience
                </PrimaryButton>
              </Box>
            )}
          </Box>
        )}
        {experiences?.length > 0 && (
          <Box width="full">
            {currentUser?.id === userData.id && (
              <Box
                width={{
                  xs: "max",
                  md: "48",
                }}
                marginTop="4"
              >
                <PrimaryButton
                  onClick={() => {
                    setModalMode("add");
                    setAddExperience(true);
                  }}
                >
                  Add Experience
                </PrimaryButton>
              </Box>
            )}
            {experiences.map((experience: LensExperience, index) => (
              <Card
                mode={mode}
                key={experience.jobTitle}
                onClick={() => {
                  setSelectedExperienceId(index);
                  setOpenExperienceView(true);
                }}
              >
                <Box
                  display="flex"
                  flexDirection={{
                    xs: "column",
                    md: "row",
                  }}
                  gap="4"
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    width={{
                      xs: "full",
                      md: "1/2",
                    }}
                    marginBottom={{
                      xs: "0",
                      md: "2",
                    }}
                  >
                    <Text variant="extraLarge" weight="semiBold">
                      {experience.jobTitle}
                    </Text>
                    <Text variant="small" weight="light">
                      {experience.company}
                    </Text>
                    {experience.linkedCredentials?.length > 0 && (
                      <Text variant="label">
                        {experience.linkedCredentials?.length} Credentials
                        Linked
                      </Text>
                    )}
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    width={{
                      xs: "full",
                      md: "1/2",
                    }}
                    alignItems={{
                      xs: "flex-start",
                      md: "flex-end",
                    }}
                    marginTop={{
                      xs: "0",
                      md: "1",
                    }}
                    marginBottom={{
                      xs: "2",
                      md: "0",
                    }}
                  >
                    {dateExists(experience.start_date) &&
                      dateExists(experience.end_date) &&
                      !experience.currentlyWorking && (
                        <Text variant="label" weight="light">
                          {`${experience.start_date.month}/${experience.start_date.day}/${experience.start_date.year} - ${experience.end_date.month}/${experience.end_date.day}/${experience.end_date.year}`}
                        </Text>
                      )}
                    {dateExists(experience.start_date) &&
                      experience.currentlyWorking && (
                        <Text variant="label" weight="light">
                          {`${experience.start_date.month}/${experience.start_date.day}/${experience.start_date.year} - Present`}
                        </Text>
                      )}
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </ScrollContainer>
    </Box>
  );
};

export default memo(Experience);
