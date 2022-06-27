import { Box, Stack, Text } from "degen";
import React, { forwardRef, useRef, useState } from "react";
import { useLocalCard } from "../hooks/LocalCardContext";
import { CalendarOutlined } from "@ant-design/icons";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import ReactDatePicker from "react-datepicker";
import ClickableTag from "@/app/common/components/EditTag/ClickableTag";

// const DatePicker = styled.input`
//   border: none;
//   border-bottom: 1px solid #ccc;
//   padding: 0.5rem;
//   width: 100%;
//   background: transparent;
//   border: 0;
//   border-style: none;
//   border-color: transparent;
//   outline: none;
//   outline-offset: 0;
//   box-shadow: none;
//   font-size: 1.8rem;
//   caret-color: rgb(191, 90, 242);
//   color: rgb(191, 90, 242);
//   font-weight: 600;

//   ::-webkit-calendar-picker-indicator {
//     cursor: pointer;
//   }
// `;

export default function CardDeadline() {
  const { deadline, setDeadline, onCardUpdate } = useLocalCard();
  const { canTakeAction } = useRoleGate();
  const dateRef = useRef<any>(null);

  // eslint-disable-next-line react/display-name
  const ExampleCustomInput = forwardRef(({ value, onClick }: any, ref) => (
    <Box onClick={onClick} ref={ref as any}>
      <ClickableTag
        name={deadline?.getDate ? value : "None"}
        icon={
          <CalendarOutlined
            style={{
              fontSize: "1rem",
              marginLeft: "0.2rem",
              marginRight: "0.2rem",
              color: "rgb(191, 90, 242, 1)",
            }}
          />
        }
        onClick={() => void 0}
      />
    </Box>
  ));

  return (
    // <EditTag
    //   tourId="create-card-modal-deadline"
    //   name={deadline?.toDateString ? deadline.toDateString() : "None"}
    //   modalTitle="Select Deadline"
    //   label="Deadline"
    //   modalOpen={modalOpen}
    //   setModalOpen={setModalOpen}
    // icon={
    //   <CalendarOutlined
    //     style={{
    //       fontSize: "1rem",
    //       marginLeft: "0.2rem",
    //       marginRight: "0.2rem",
    //       color: "rgb(191, 90, 242, 1)",
    //     }}
    //   />
    //   }
    //   disabled={!canTakeAction("cardDeadline")}
    //   handleClose={() => {
    //     onCardUpdate();
    //     setModalOpen(false);
    //   }}
    // >
    //   <Box height="44">
    //     <Box
    //       padding="16"
    //       display="flex"
    //       flexDirection="column"
    //       alignItems="center"
    //       justifyContent="space-between"
    //       style={{ height: "100%" }}
    //     >
    //       {/* <DatePicker
    //         type="datetime-local"
    //         value={toIsoString(deadline as Date).substring(0, 16)}
    //         onChange={(e) => {
    //           console.log(e.target.value);
    //           if (e.target.value) {
    //             setDeadline(new Date(e.target.value));
    //           } else {
    //             setDeadline(null);
    //           }
    //         }}
    //       /> */}
    // <ReactDatePicker
    //   ref={dateRef}
    //   selected={deadline?.getDay ? deadline : new Date()}
    //   onChange={(date: Date) => setDeadline(date)}
    // />
    //     </Box>
    //   </Box>
    // </EditTag>
    <Stack direction="horizontal">
      <Box width="1/3">
        <Text variant="label">Deadline</Text>
      </Box>
      <Box width="2/3">
        <ReactDatePicker
          ref={dateRef}
          selected={deadline?.getDay ? deadline : new Date()}
          onChange={(date: Date) => {
            setDeadline(date);
            console.log({ date });
            if (!date) {
              setTimeout(() => {
                onCardUpdate();
              }, 500);
            }
          }}
          customInput={<ExampleCustomInput />}
          disabled={!canTakeAction("cardDeadline")}
          onCalendarClose={() => {
            onCardUpdate();
          }}
          isClearable
        />
      </Box>
    </Stack>
  );
}
