import { memo, useState, useEffect } from "react";
import { Box, Text, Tag, Avatar, useTheme, Stack } from "degen";
import { UserType, CardDetails } from "@/app/types";
import { PriorityIcon } from "@/app/common/components/PriorityIcon";
import styled from "styled-components";
import ReactPaginate from "react-paginate";
import { ScrollContainer, Card, TextBox, GigInfo, Tags } from "./index";
import PrimaryButton from "@/app/common/components/PrimaryButton";

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

const Education = ({ userData }: { userData: UserType }) => {
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [endOffset, setEndOffset] = useState(0);
  const [addEducation, setAddEducation] = useState(false);
  const [addFromLens, setAddFromLens] = useState(false);
  const [editEducation, setEditEducation] = useState(false);
  const [editEducationId, setEditEducationId] = useState("");

  const { mode } = useTheme();

  const educationOrder = userData.educationOrder;
  const education = userData.education;

  useEffect(() => {
    setEndOffset(itemOffset + 5);
    if (userData.educationOrder?.length < 6) {
      setPageCount(Math.floor(userData.educationOrder?.length / 5));
    } else {
      setPageCount(Math.ceil(userData.educationOrder?.length / 5));
    }
  }, [educationOrder?.length, endOffset, itemOffset]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * 5) % educationOrder?.length;
    setItemOffset(newOffset);
  };

  return (
    <Box>
      <ScrollContainer>
        {!educationOrder?.length && (
          <>
            <Box style={{ margin: "35vh 15vw" }}>
              <Text color="accent" align="center">
                You havent added your education yet :/
              </Text>
              <Box marginTop="4">
                <Stack direction="horizontal" space="4">
                  <PrimaryButton
                    variant="tertiary"
                    onClick={() => setAddEducation(true)}
                  >
                    Add Education
                  </PrimaryButton>
                  <PrimaryButton
                    variant="tertiary"
                    onClick={() => setAddEducation(true)}
                  >
                    Import from Lens
                  </PrimaryButton>{" "}
                </Stack>
              </Box>
            </Box>
          </>
        )}
        {educationOrder
          ?.slice(0)
          .slice(itemOffset, endOffset)
          .map((experienceId: string) => {
            return (
              <Card mode={mode} key={experienceId}>
                <TextBox>
                  <Text variant="extraLarge" wordBreak="break-word">
                    {education[experienceId].title}
                  </Text>
                </TextBox>
              </Card>
            );
          })}
      </ScrollContainer>
      {
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
      }
    </Box>
  );
};

export default memo(Education);
