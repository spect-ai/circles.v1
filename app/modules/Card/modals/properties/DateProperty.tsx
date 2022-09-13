import { Box, Stack, Text, useTheme } from "degen";
import React, { forwardRef, memo, useEffect, useRef, useState } from "react";
import { useLocalCard } from "../../../Project/CreateCardModal/hooks/LocalCardContext";
import { CalendarOutlined } from "@ant-design/icons";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import ReactDatePicker from "react-datepicker";
import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import { toast } from "react-toastify";
import { useLocalProject } from "@/app/modules/Project/Context/LocalProjectContext";
import { ProjectType } from "@/app/types";

export type props = {
  templateId?: string;
  propertyId: string;
};

function DateProperty({ templateId, propertyId }: props) {
  const {
    onCardUpdate,
    updatePropertyState,
    project,
    properties: cardProperties,
  } = useLocalCard();
  const { properties } = project as ProjectType;

  const { canTakeAction } = useRoleGate();
  const dateRef = useRef<any>(null);
  const { mode } = useTheme();
  const [localProperty, setLocalProperty] = useState(
    cardProperties && cardProperties[propertyId]
  );

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

  useEffect(() => {
    if (cardProperties && cardProperties[propertyId]) {
      setLocalProperty(new Date(cardProperties[propertyId]));
    } else if (properties[propertyId].default) {
      setLocalProperty(new Date(properties[propertyId].default));
    }
  }, [cardProperties]);

  // eslint-disable-next-line react/display-name
  const ExampleCustomInput = forwardRef(({ value, onClick }: any, ref) => (
    <Box onClick={onClick} ref={ref as any}>
      <ClickableTag
        name={localProperty ? value : "None"}
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
        <Text variant="label">{`${properties[propertyId]?.name}`}</Text>
      </Box>
      <Box width="2/3">
        <ReactDatePicker
          ref={dateRef}
          selected={localProperty?.getTime ? localProperty : new Date()}
          onChange={(date: Date) => {
            if (
              date.getTime() ===
              (localProperty?.getTime && localProperty.getTime())
            ) {
              updatePropertyState(propertyId, null);
              return;
            }
            updatePropertyState(propertyId, date);
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

export default memo(DateProperty);
