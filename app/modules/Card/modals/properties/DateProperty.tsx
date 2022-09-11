import { Box, Stack, Text, useTheme } from "degen";
import React, { forwardRef, memo, useEffect, useRef, useState } from "react";
import { useLocalCard } from "../../../Project/CreateCardModal/hooks/LocalCardContext";
import { CalendarOutlined } from "@ant-design/icons";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import ReactDatePicker from "react-datepicker";
import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import { toast } from "react-toastify";
import { useLocalProject } from "@/app/modules/Project/Context/LocalProjectContext";

export type props = {
  templateId?: string;
  propertyId: string;
};

function DateProperty({ templateId, propertyId }: props) {
  const { onCardUpdate, properties, updatePropertyState, project } =
    useLocalCard();
  const { canTakeAction } = useRoleGate();
  const dateRef = useRef<any>(null);

  const { mode } = useTheme();
  const [template, setTemplate] = useState(templateId || "Task");
  const [propertyInProjectTemplate, setPropertyInProjectTemplate] = useState(
    project?.cardTemplates[templateId || "Task"].properties[propertyId]
  );
  const cardProperty = properties[propertyId];

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
        name={cardProperty?.value ? value : "None"}
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
        <Text variant="label">{`${propertyInProjectTemplate?.name}`}</Text>
      </Box>
      <Box width="2/3">
        <ReactDatePicker
          ref={dateRef}
          selected={
            cardProperty?.value?.getDay ? cardProperty.value : new Date()
          }
          onChange={(date: Date) => {
            if (
              date.getTime() ===
              (cardProperty?.value?.getTime && cardProperty.value.getTime())
            ) {
              updatePropertyState(propertyId, null);
              return;
            }
            updatePropertyState(propertyId, date);
          }}
          customInput={<ExampleCustomInput />}
          //disabled={!canTakeAction("cardDeadline")}
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

export default memo(DateProperty);
