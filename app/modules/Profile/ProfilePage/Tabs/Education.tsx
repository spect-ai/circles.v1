import PrimaryButton from "@/app/common/components/PrimaryButton";
import { LensDate, LensEducation, UserType } from "@/app/types";
import { Box, Text, useTheme } from "degen";
import { memo, useEffect, useState } from "react";
import { useQuery } from "react-query";
import AddEducationModal from "../AddEducationModal";
import ViewEducationModal from "../ViewEducationModal";
import { Card, ScrollContainer } from "./index";

const Education = ({ userData }: { userData: UserType }) => {
  const [openEducationModal, setOpenEducationModal] = useState(false);
  const [selectedEducationId, setSelectedEducationId] = useState<number>();
  const [openEducationView, setOpenEducationView] = useState(false);
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const { mode } = useTheme();

  const education = userData.education;

  const dateExists = (date: LensDate) => {
    return date.day && date.month && date.year;
  };

  return (
    <Box>
      {openEducationView && (
        <ViewEducationModal
          educationId={selectedEducationId}
          handleClose={() => setOpenEducationView(false)}
          setEditEducation={(value) => {
            if (value) {
              setModalMode("edit");
              setOpenEducationModal(true);
            }
          }}
        />
      )}
      {openEducationModal && (
        <AddEducationModal
          modalMode={modalMode}
          handleClose={() => setOpenEducationModal(false)}
          educationId={selectedEducationId}
        />
      )}
      <ScrollContainer>
        {!education?.length && (
          <Box style={{ margin: "35vh 15vw" }}>
            <Text color="accent" align="center">
              You havent added your education yet :/
            </Text>
            {currentUser?.id === userData.id && (
              <Box marginTop="4">
                <PrimaryButton
                  variant="tertiary"
                  onClick={() => {
                    setModalMode("add");
                    setOpenEducationModal(true);
                  }}
                >
                  Add Education
                </PrimaryButton>
              </Box>
            )}
          </Box>
        )}
        {education?.length > 0 && (
          <>
            {currentUser?.id === userData.id && (
              <Box width="48" marginTop="4">
                <PrimaryButton
                  onClick={() => {
                    setModalMode("add");
                    setOpenEducationModal(true);
                  }}
                >
                  Add Education
                </PrimaryButton>
              </Box>
            )}
            {education.map((edu: LensEducation, index) => {
              return (
                <Card
                  mode={mode}
                  key={index}
                  onClick={() => {
                    setSelectedEducationId(index);
                    setOpenEducationView(true);
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
                        {edu.courseDegree}
                      </Text>
                      <Text variant="small">{edu.school}</Text>

                      {edu.linkedCredentials?.length > 0 && (
                        <Text variant="label">
                          {edu.linkedCredentials?.length} Credentials Linked
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
                      {dateExists(edu.start_date) &&
                        dateExists(edu.end_date) &&
                        !edu.currentlyStudying && (
                          <Text variant="label" weight="light">
                            {`${edu.start_date.month}/${edu.start_date.day}/${edu.start_date.year} - ${edu.end_date.month}/${edu.end_date.day}/${edu.end_date.year}`}
                          </Text>
                        )}
                      {dateExists(edu.start_date) && edu.currentlyStudying && (
                        <Text variant="label" weight="light">
                          {`${edu.start_date.month}/${edu.start_date.day}/${edu.start_date.year} - Present`}
                        </Text>
                      )}
                    </Box>
                  </Box>
                </Card>
              );
            })}
          </>
        )}
      </ScrollContainer>
    </Box>
  );
};

export default memo(Education);
