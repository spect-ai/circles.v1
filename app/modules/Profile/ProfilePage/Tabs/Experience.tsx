import { memo, useState, useEffect } from "react";
import { Box, Text, Tag, Avatar, useTheme, Stack, Button } from "degen";
import { UserType, CardDetails, LensExperience, LensDate } from "@/app/types";
import { PriorityIcon } from "@/app/common/components/PriorityIcon";
import styled from "styled-components";
import ReactPaginate from "react-paginate";
import { ScrollContainer, Card, TextBox, GigInfo, Tags } from "./index";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import AddExperienceModal from "../AddExperienceModal";
import LensImportModal from "../LensImportModal";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import router from "next/router";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { IconButton } from "@/app/modules/Project/ProjectHeading";
import ViewExperienceModal from "../ViewExperienceModal";
import { useGlobal } from "@/app/context/globalContext";
import { useQuery } from "react-query";

const Paginate = styled(ReactPaginate)<{ mode: string }>`
  display: flex;
  flex-direction: row;
  width: 30rem;
  margin: 1rem auto;
  justify-content: space-between;
  list-style-type: none;
  li a {
    border-radius: 7px;
    padding: 0.1rem 0.5rem;
    border: ${(props) =>
        props.mode === "dark"
          ? "rgb(255, 255, 255, 0.02)"
          : "rgb(20, 20, 20, 0.2)"}
      1px solid;
    cursor: pointer;
    color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(20, 20, 20, 0.5)"};
  }
  li.selected a {
    color: rgb(191, 90, 242, 1);
    border-color: rgb(191, 90, 242, 0.2);
  }
  li.previous a,
  li.next a,
  li.break a {
    border-color: transparent;
  }
  li.active a {
    border-color: transparent;
    color: rgb(191, 90, 242, 1);
    min-width: 32px;
  }
  li.disabled a {
    color: grey;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
`;

const Experience = ({ userData }: { userData: UserType }) => {
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [endOffset, setEndOffset] = useState(0);
  const { mode } = useTheme();
  const [addExperience, setAddExperience] = useState(false);
  const [addFromLens, setAddFromLens] = useState(false);
  const [selectedExperienceId, setSelectedExperienceId] = useState<number>(0);
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [openExperienceView, setOpenExperienceView] = useState(false);
  const experiences = userData.experiences;

  const dateExists = (date: LensDate) => {
    return date.day && date.month && date.year;
  };

  useEffect(() => {
    setEndOffset(itemOffset + 5);
    if (experiences?.length < 6) {
      setPageCount(Math.floor(experiences?.length / 5));
    } else {
      setPageCount(Math.ceil(experiences?.length / 5));
    }
  }, [experiences?.length, endOffset, itemOffset]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * 5) % experiences?.length;
    setItemOffset(newOffset);
  };

  return (
    <Box>
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
        />
      )}
      <ScrollContainer>
        {!experiences?.length && (
          <Box style={{ margin: "35vh 15vw" }}>
            <Text color="accent" align="center">
              No experience yet :/
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
        {experiences?.length && (
          <>
            {currentUser?.id === userData.id && (
              <Box
                width={{
                  sm: "max",
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
            {experiences
              ?.slice(0)
              .slice(itemOffset, endOffset)
              .map((experience: LensExperience, index) => {
                return (
                  <Card
                    mode={mode}
                    key={index}
                    onClick={() => {
                      setSelectedExperienceId(index);
                      setOpenExperienceView(true);
                    }}
                  >
                    <Box display="flex" flexDirection="row" gap="4">
                      <Box
                        display="flex"
                        flexDirection="column"
                        width="128"
                        marginBottom="4"
                      >
                        <Text variant="extraLarge" weight="semiBold">
                          {experience.jobTitle}
                        </Text>
                        <Text variant="small" weight="light">
                          {experience.company}
                        </Text>
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
          </>
        )}
      </ScrollContainer>
      <Paginate
        breakLabel="..."
        nextLabel="Next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        pageCount={pageCount}
        previousLabel="Previous"
        renderOnZeroPageCount={() => null}
        mode={mode}
      />
    </Box>
  );
};

export default memo(Experience);
