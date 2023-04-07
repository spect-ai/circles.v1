import PrimaryButton from "@/app/common/components/PrimaryButton";
import { LensDate, LensEducation, UserType } from "@/app/types";
import { Box, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import { memo, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import AddEducationModal from "../AddEducationModal";
import ViewEducationModal from "../ViewEducationModal";

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

const Education = ({
  userData,
  allCredentials,
}: {
  userData: UserType;
  allCredentials: { [id: string]: unknown[] };
}) => {
  const [openEducationModal, setOpenEducationModal] = useState(false);
  const [selectedEducationId, setSelectedEducationId] = useState<number>();
  const [openEducationView, setOpenEducationView] = useState(false);
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const { mode } = useTheme();

  const { education } = userData;

  const dateExists = (date: LensDate) => date?.day && date?.month && date?.year;

  return (
    <Box>
      <AnimatePresence>
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
        )}{" "}
      </AnimatePresence>

      <AnimatePresence>
        {openEducationModal && (
          <AddEducationModal
            modalMode={modalMode}
            handleClose={() => setOpenEducationModal(false)}
            educationId={selectedEducationId}
            allCredentials={allCredentials}
          />
        )}{" "}
      </AnimatePresence>

      <ScrollContainer>
        {!education?.length && (
          <Box style={{ margin: "35vh 15vw" }}>
            <Text color="accent" align="center">
              No education added yet
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
            {education.map((edu: LensEducation, index) => (
              <Card
                mode={mode}
                key={edu.description}
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
                    {dateExists(edu?.start_date) &&
                      dateExists(edu?.end_date) &&
                      !edu?.currentlyStudying && (
                        <Text variant="label" weight="light">
                          {`${edu.start_date.month}/${edu.start_date.day}/${edu.start_date.year} - ${edu.end_date.month}/${edu.end_date.day}/${edu.end_date.year}`}
                        </Text>
                      )}
                    {dateExists(edu?.start_date) && edu?.currentlyStudying && (
                      <Text variant="label" weight="light">
                        {`${edu.start_date.month}/${edu.start_date.day}/${edu.start_date.year} - Present`}
                      </Text>
                    )}
                  </Box>
                </Box>
              </Card>
            ))}
          </>
        )}
      </ScrollContainer>
    </Box>
  );
};

export default memo(Education);
