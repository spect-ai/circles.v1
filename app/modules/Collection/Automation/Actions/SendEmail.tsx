import Dropdown from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { Action, CollectionType, Option } from "@/app/types";
import { Box, Input, Text, Textarea } from "degen";
import { useEffect, useState } from "react";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

type Props = {
  actionMode: "edit" | "create";
  action: Action;
  setAction: (action: Action) => void;
  collection: CollectionType;
};

export default function SendEmail({
  setAction,
  actionMode,
  action,
  collection,
}: Props) {
  const [propertyOptions, setPropertyOptions] = useState([] as Option[]);

  const { circle } = useCircle();

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
    <Box marginTop="2" width="full" onBlur={() => {}}>
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
          selected={
            action.data?.toEmailProperties?.map(
              (propertyId: string) =>
                ({ value: propertyId, label: propertyId } as Option)
            ) || []
          }
          onChange={(value) => {
            setAction({
              ...action,
              data: {
                ...action.data,
                toEmailProperties: value.map((property: any) => property.value),
                circleId: circle?.id || "",
              },
            });
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
          value={action.data?.message}
          onChange={(e) => {
            // setMessage(e.target.value);
            setAction({
              ...action,
              data: {
                ...action.data,
                message: e.target.value,
                circleId: circle?.id || "",
              },
            });
          }}
        />
      </Box>
    </Box>
  );
}
