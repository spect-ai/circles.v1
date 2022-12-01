import Dropdown from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { Action, Option } from "@/app/types";
import { Box, Input, Text, Textarea } from "degen";
import { useEffect, useState } from "react";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

type Props = {
  actionMode: "edit" | "create";
  action: Action;
  setAction: (action: Action) => void;
};

export default function SendEmail({ setAction, actionMode, action }: Props) {
  const [message, setMessage] = useState(action.data?.message || "");
  const [propertyOptions, setPropertyOptions] = useState([] as Option[]);
  const [toEmailProperties, setToEmailProperties] = useState(
    action.data?.toEmailProperties || []
  );
  const { circle } = useCircle();
  const { localCollection: collection } = useLocalCollection();

  useEffect(() => {
    setMessage(action.data?.message || "");
  }, [action]);

  useEffect(() => {
    setPropertyOptions(
      Object.entries(collection.properties)
        .filter(([propertyId, prop]) => prop.type === "email")
        .map(([propertyId, prop]) => {
          return {
            label: prop.name,
            value: propertyId,
          };
        })
    );
  }, []);

  return (
    <Box
      marginTop="2"
      width="full"
      onBlur={() => {
        setAction({
          ...action,
          data: {
            message: message,
            circleId: circle.id,
            toEmailProperties: toEmailProperties.map(
              (property: any) => property.value
            ),
          },
        });
      }}
    >
      {" "}
      <Box
        marginBottom="2"
        width="full"
        display="flex"
        flexDirection="column"
        gap="2"
      >
        <Text variant="label">
          Send email to (form must have at least one email field)
        </Text>

        <Dropdown
          options={propertyOptions}
          selected={toEmailProperties}
          onChange={(value) => {
            setToEmailProperties(value);
          }}
          multiple={true}
        />
        <Text variant="label">With message</Text>
        <Textarea
          label
          hideLabel
          maxLength={500}
          rows={3}
          placeholder="Message to send in email"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
      </Box>
    </Box>
  );
}
