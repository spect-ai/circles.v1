import CheckBox from "@/app/common/components/Table/Checkbox";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { updateFormCollection } from "@/app/services/Collection";
import { Box, Stack, Tag, Text } from "degen";
import { useEffect, useState } from "react";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { reservedRoles } from "@/app/modules/Circle/ContributorsModal/InviteMembersModal/constants";

export function Notifications() {
  const { circle } = useCircle();
  const circleRoles = Object.keys(circle?.roles || {});
  const [
    circleRolesToNotifyUponNewResponse,
    setCircleRolesToNotifyUponNewResponse,
  ] = useState([] as boolean[]);

  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [notifOnNewResponses, setNotifOnNewResponses] = useState(false);

  console.log({
    circleRolesToNotifyUponNewResponse,
    circleRoles,
    notifOnNewResponses,
  });

  useEffect(() => {
    console.log("here");
    if (collection) {
      // const validRoles = new Set(circleRoles);
      const newResponseRolesToEmail = new Set(
        collection.circleRolesToNotifyUponNewResponse || []
      );
      console.log({
        newResponseRolesToEmail,
        c: collection.circleRolesToNotifyUponNewResponse,
      });
      const circleRolesToNotifyUponNewResponse = [] as boolean[];
      for (const role of circleRoles) {
        circleRolesToNotifyUponNewResponse.push(
          newResponseRolesToEmail.has(role)
        );
      }
      setNotifOnNewResponses(
        collection?.circleRolesToNotifyUponNewResponse?.length ? true : false
      );
      setCircleRolesToNotifyUponNewResponse(circleRolesToNotifyUponNewResponse);
      console.log({ circleRolesToNotifyUponNewResponse });
    }
  }, []);

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
                onClick={async () => {
                  setNotifOnNewResponses(!notifOnNewResponses);
                  setCircleRolesToNotifyUponNewResponse(
                    circleRoles.map(() => notifOnNewResponses)
                  );
                  const res = await updateFormCollection(collection.id, {
                    circleRolesToNotifyUponNewResponse: [],
                  });
                  updateCollection(res);
                }}
              />
              <Text variant="base">Send notifications on new responses</Text>
            </Box>
            {notifOnNewResponses && (
              <Stack direction="horizontal" space="2" wrap>
                {circleRoles?.map((role, index) => {
                  if (reservedRoles.includes(role)) return null;
                  return (
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

                        console.log({ roleSet });
                        const res = await updateFormCollection(collection.id, {
                          circleRolesToNotifyUponNewResponse:
                            Array.from(roleSet),
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
                  );
                })}
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
