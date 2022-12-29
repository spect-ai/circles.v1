import CheckBox from "@/app/common/components/Table/Checkbox";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { updateFormCollection } from "@/app/services/Collection";
import { Box, Stack, Tag, Text } from "degen";
import { useEffect, useState } from "react";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

export function Notifications() {
  const { circle } = useCircle();
  const [notifOnNewResponses, setNotifOnNewResponses] = useState(false);
  const [circleRoles, setCircleRoles] = useState([] as string[]);
  const [
    circleRolesToNotifyUponNewResponse,
    setCircleRolesToNotifyUponNewResponse,
  ] = useState([] as boolean[]);

  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  useEffect(() => {
    if (collection.formMetadata) {
      const newResponseRolesToEmail = new Set(
        collection.circleRolesToNotifyUponNewResponse || []
      );
      const updatedResponseRolesToEmail = new Set(
        collection.circleRolesToNotifyUponUpdatedResponse || []
      );
      const circleRolesToNotifyUponNewResponse = [] as boolean[];
      const circleRolesToNotifyUponUpdatedResponse = [] as boolean[];
      for (const role of circleRoles) {
        circleRolesToNotifyUponNewResponse.push(
          newResponseRolesToEmail.has(role)
        );
        circleRolesToNotifyUponUpdatedResponse.push(
          updatedResponseRolesToEmail.has(role)
        );
      }

      setCircleRolesToNotifyUponNewResponse(circleRolesToNotifyUponNewResponse);
      if (collection.circleRolesToNotifyUponNewResponse) {
        setNotifOnNewResponses(
          collection.circleRolesToNotifyUponNewResponse?.length > 0
        );
      }
    }
  }, [circleRoles, collection]);

  useEffect(() => {
    if (circle && circle.roles) setCircleRoles(Object.keys(circle.roles));
  }, [circle]);

  return (
    <>
      <Text variant="label">Notifications</Text>
      <Stack direction="vertical">
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Box display="flex" flexDirection="column" gap="2">
            <Box display="flex" flexDirection="row" gap="2" alignItems="center">
              <CheckBox
                isChecked={notifOnNewResponses}
                onClick={() => {
                  if (notifOnNewResponses) {
                    setCircleRolesToNotifyUponNewResponse([]);
                    setNotifOnNewResponses(false);
                  } else {
                    setNotifOnNewResponses(true);
                  }
                }}
              />
              <Text variant="base">Send notifications on new responses</Text>
            </Box>
            {notifOnNewResponses && (
              <Stack direction="horizontal" space="2" wrap>
                {circleRoles?.map((role, index) => (
                  <Box
                    key={index}
                    cursor="pointer"
                    onClick={async () => {
                      circleRolesToNotifyUponNewResponse[index] =
                        !circleRolesToNotifyUponNewResponse[index];
                      setCircleRolesToNotifyUponNewResponse([
                        ...circleRolesToNotifyUponNewResponse,
                      ]);
                      const roleSet = new Set(
                        collection.circleRolesToNotifyUponNewResponse || []
                      );
                      if (circleRolesToNotifyUponNewResponse[index]) {
                        roleSet.add(role);
                      } else {
                        roleSet.delete(role);
                      }

                      const res = await updateFormCollection(collection.id, {
                        circleRolesToNotifyUponNewResponse: Array.from(roleSet),
                      });
                      updateCollection(res);
                    }}
                  >
                    {circleRolesToNotifyUponNewResponse[index] ? (
                      <Tag tone={"accent"} hover>
                        <Box paddingX="2">{role}</Box>
                      </Tag>
                    ) : (
                      <Tag hover>
                        <Box paddingX="2">{role}</Box>
                      </Tag>
                    )}
                  </Box>
                ))}
              </Stack>
            )}
            {notifOnNewResponses && (
              <Text variant="small">
                {" "}
                Pick the roles that get notified. Notifications are currently
                sent via email. Please make sure to add your email.{" "}
              </Text>
            )}
          </Box>
        </Box>
      </Stack>
    </>
  );
}
