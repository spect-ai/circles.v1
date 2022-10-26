import { useGlobal } from "@/app/context/globalContext";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { updateFormCollection } from "@/app/services/Collection";
import { Box, Stack, Tag, Text } from "degen";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

const Input = styled.input`
  background-color: transparent;
  border: none;
  margin: 0.4rem;
  padding: 0.4rem;
  display: flex;
  border-style: none;
  border-color: transparent;
  border-radius: 0.4rem;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 400;
  opacity: "40%";
`;

export function Notifications() {
  const { circle } = useCircle();
  const [notifOnNewResponses, setNotifOnNewResponses] = useState(false);
  const [notifOnUpdatedResponses, setNotifOnUpdatedResponses] = useState(false);
  const [circleRoles, setCircleRoles] = useState([] as string[]);
  const [
    circleRolesToNotifyUponNewResponse,
    setCircleRolesToNotifyUponNewResponse,
  ] = useState([] as boolean[]);
  const [
    circleRolesToNotifyUponUpdatedResponse,
    setCircleRolesToNotifyUponUpdatedResponse,
  ] = useState([] as boolean[]);

  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const { connectedUser } = useGlobal();

  useEffect(() => {
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
    setCircleRolesToNotifyUponUpdatedResponse(
      circleRolesToNotifyUponUpdatedResponse
    );
    setNotifOnNewResponses(
      collection.circleRolesToNotifyUponNewResponse?.length > 0
    );
    setNotifOnUpdatedResponses(
      collection.circleRolesToNotifyUponUpdatedResponse?.length > 0
    );
  }, [collection]);

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
              <Input
                type="checkbox"
                checked={notifOnNewResponses}
                onChange={(e) => {
                  if (notifOnNewResponses) {
                    setCircleRolesToNotifyUponNewResponse([]);
                    setNotifOnNewResponses(false);
                  } else {
                    setNotifOnNewResponses(true);
                  }
                }}
              />
              <Text variant="small">Send notifications on new responses</Text>
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
                      console.log(circleRolesToNotifyUponNewResponse);
                      const roleSet = new Set(
                        collection.circleRolesToNotifyUponNewResponse || []
                      );
                      if (circleRolesToNotifyUponNewResponse[index]) {
                        roleSet.add(role);
                      } else {
                        roleSet.delete(role);
                      }
                      console.log(roleSet);

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
              <Text variant="label">
                {" "}
                Notifications are currently sent via email. Please make sure to
                add your email.{" "}
              </Text>
            )}
          </Box>
        </Box>
        {/* <Box
          display="flex"
          flexDirection="row"
          gap="2"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Box display="flex" flexDirection="column" gap="2">
            <Box display="flex" flexDirection="row" gap="2" alignItems="center">
              <Input
                type="checkbox"
                checked={notifOnUpdatedResponses}
                onChange={(e) => {
                  if (notifOnUpdatedResponses) {
                    setCircleRolesToNotifyUponUpdatedResponse([]);
                    setNotifOnUpdatedResponses(false);
                  } else {
                    setNotifOnUpdatedResponses(true);
                  }
                }}
              />

              <Text variant="label">
                Send notifications on updated responses
              </Text>
            </Box>
            <Stack direction="horizontal" space="2" wrap>
              {notifOnUpdatedResponses && (
                <>
                  {circleRoles?.map((role, index) => (
                    <Box
                      key={index}
                      cursor="pointer"
                      onClick={async () => {
                        if (connectedUser) {
                          circleRolesToNotifyUponUpdatedResponse[index] =
                            !circleRolesToNotifyUponUpdatedResponse[index];
                          setCircleRolesToNotifyUponUpdatedResponse([
                            ...circleRolesToNotifyUponUpdatedResponse,
                          ]);
                          const roleSet = new Set(
                            collection.circleRolesToNotifyUponUpdatedResponse ||
                              []
                          );
                          if (circleRolesToNotifyUponUpdatedResponse[index]) {
                            roleSet.add(role);
                          } else {
                            roleSet.delete(role);
                          }
                          const res = await updateFormCollection(
                            collection.id,
                            {
                              circleRolesToNotifyUponUpdatedResponse:
                                Array.from(roleSet),
                            }
                          );
                          console.log(res);
                          updateCollection(res);
                        }
                      }}
                    >
                      {circleRolesToNotifyUponUpdatedResponse[index] ? (
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
                </>
              )}
            </Stack>
          </Box>
        </Box> */}
      </Stack>
    </>
  );
}
