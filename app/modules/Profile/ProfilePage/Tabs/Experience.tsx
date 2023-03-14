import PrimaryButton from "@/app/common/components/PrimaryButton";
import { LensDate, LensExperience, UserType } from "@/app/types";
import { Box, Text, useTheme } from "degen";
import { memo, useEffect, useState } from "react";
import { useQuery } from "react-query";
import AddExperienceModal from "../AddExperienceModal";
import LensImportModal from "../LensImportModal";
import ViewExperienceModal from "../ViewExperienceModal";
import { Card, ScrollContainer } from "./index";

const Experience = ({ userData }: { userData: UserType }) => {
  const { mode } = useTheme();
  const [addExperience, setAddExperience] = useState(false);
  const [addFromLens, setAddFromLens] = useState(false);
  const [selectedExperienceId, setSelectedExperienceId] = useState<number>();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [openExperienceView, setOpenExperienceView] = useState(false);
  const experiences = userData.experiences;

  const dateExists = (date: LensDate) => {
    return date.day && date.month && date.year;
  };

  return (
    <Box width="full">
      {addFromLens && (
        <LensImportModal handleClose={() => setAddFromLens(false)} />
      )}
      {addExperience && (
        <AddExperienceModal
          modalMode={modalMode}
          experienceId={selectedExperienceId}
          handleClose={() => setAddExperience(false)}
        />
      )}
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
            {experiences.map((experience: LensExperience, index) => {
              return (
                <Card
                  mode={mode}
                  key={index}
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
              );
            })}
          </Box>
        )}
      </ScrollContainer>
    </Box>
  );
};

export default memo(Experience);
