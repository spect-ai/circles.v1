import EditTag from "@/app/common/components/EditTag";
import { Box } from "degen";
import React, { useState } from "react";
import styled from "styled-components";
import { useCreateCard } from "../hooks/createCardContext";
import DateTimePicker from "react-datetime-picker/dist/entry.nostyle";

const DatePicker = styled.input`
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 0.5rem;
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.8rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 600;

  ::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;

export default function CardDeadline() {
  const [modalOpen, setModalOpen] = useState(false);
  const { deadline, setDeadline } = useCreateCard();
  return (
    <EditTag
      name={"Add Deadline"}
      modalTitle="Select Deadline"
      tagLabel={deadline ? "Change" : ""}
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
    >
      <Box height="96">
        <Box
          padding="16"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
          style={{ height: "90%" }}
        >
          <DatePicker
            type="datetime-local"
            value={deadline.toISOString().substring(0, 10)}
            onChange={(e) => {
              setDeadline(new Date(e.target.value));
            }}
          />
        </Box>
      </Box>
    </EditTag>
  );
}
