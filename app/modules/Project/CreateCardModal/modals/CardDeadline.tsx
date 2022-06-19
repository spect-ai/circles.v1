import EditTag from "@/app/common/components/EditTag";
import { Box } from "degen";
import React, { useState } from "react";
import styled from "styled-components";
import { useLocalCard } from "../hooks/LocalCardContext";
import { CalendarOutlined } from "@ant-design/icons";
import { toIsoString } from "@/app/common/utils/utils";

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
  const { deadline, setDeadline } = useLocalCard();
  return (
    <EditTag
      name={deadline?.toDateString ? deadline.toDateString() : "None"}
      modalTitle="Select Deadline"
      label="Deadline"
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      icon={
        <CalendarOutlined
          style={{
            fontSize: "1rem",
            marginLeft: "0.2rem",
            marginRight: "0.2rem",
            color: "rgb(175, 82, 222, 1)",
          }}
        />
      }
    >
      <Box height="44">
        <Box
          padding="16"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
          style={{ height: "100%" }}
        >
          <DatePicker
            type="datetime-local"
            value={toIsoString(deadline).substring(0, 16)}
            onChange={(e) => {
              const d = new Date(e.target.value);
              setDeadline(new Date(e.target.value));
            }}
          />
        </Box>
      </Box>
    </EditTag>
  );
}
