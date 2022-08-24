import { Box, Stack, Text, useTheme } from "degen";
import React, { forwardRef, memo, useEffect, useRef } from "react";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import { CalendarOutlined } from "@ant-design/icons";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import ReactDatePicker from "react-datepicker";
import ClickableTag from "@/app/common/components/EditTag/ClickableTag";

function CardDeadline() {
  const { deadline, setDeadline, onCardUpdate } = useLocalCard();
  const { canTakeAction } = useRoleGate();
  const dateRef = useRef<any>(null);

  const { mode } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--background-color",
      `${mode === "dark" ? "rgb(20,20,20)" : "rgb(240,240,240)"}`
    );
    document.documentElement.style.setProperty(
      "--text-color",
      `${mode === "dark" ? "rgb(240,240,240)" : "rgb(20,20,20)"}`
    );
  }, [mode]);

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
    <Stack direction="horizontal">
      <Box width="1/3">
        <Text variant="label">Deadline</Text>
      </Box>
      <Box width="2/3">
        <ReactDatePicker
          ref={dateRef}
          selected={deadline?.getDay ? deadline : new Date()}
          onChange={(date: Date) => {
            if (date.getTime() === (deadline?.getTime && deadline.getTime())) {
              setDeadline(null);
              return;
            }
            setDeadline(date);
          }}
          customInput={<ExampleCustomInput />}
          disabled={!canTakeAction("cardDeadline")}
          onCalendarClose={() => {
            setTimeout(() => {
              void onCardUpdate();
            }, 100);
          }}
        />
      </Box>
    </Stack>
  );
}

export default memo(CardDeadline);
