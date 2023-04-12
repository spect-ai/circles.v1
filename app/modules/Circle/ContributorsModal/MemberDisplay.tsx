import React, { useState } from "react";
import {
  Avatar,
  Box,
  IconClose,
  IconPlusSmall,
  Stack,
  Tag,
  Text,
  useTheme,
} from "degen";
import styled from "styled-components";
import { CircleType, UserType } from "@/app/types";
import Popover from "@/app/common/components/Popover";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { removeMember, updateMemberRole } from "@/app/services/CircleRoles";
import queryClient from "@/app/common/utils/queryClient";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";

type Props = {
  member: string;
  memberDetails:
    | {
        [id: string]: UserType;
      }
    | undefined;
};

const Container = styled(Box)`
  cursor: pointer;
  &:hover {
    border-color: rgb(191, 90, 242, 1);
  }
`;

const RoleOption = styled(Box)<{ mode: string }>`
  cursor: pointer;
  &:hover {
    background-color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 20, 20, 0.1)"};
  }
`;

export default function MemberDisplay({ member, memberDetails }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRolePopoverOpen, setIsRolePopoverOpen] = useState(false);
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  const { canDo } = useRoleGate();

  const [userRoles, setUserRoles] = useState(circle?.memberRoles[member]);
  const { mode } = useTheme();
  const childRef = React.useRef(null);

  if (!memberDetails || !circle) {
    return null;
  }

  return (
    <Popover
      width="fit"
      dependentRef={childRef}
      butttonComponent={
        <Container
          paddingY="1"
          paddingX="4"
          display="flex"
          borderWidth="0.5"
          borderRadius="3xLarge"
          alignItems="center"
          marginRight="2"
          marginTop="2"
          transitionDuration="700"
          onClick={() => canDo("manageMembers") && setIsOpen(!isOpen)}
        >
          <Avatar
            src={
              memberDetails[member]?.avatar ||
              `https://api.dicebear.com/5.x/thumbs/svg?seed=${memberDetails[member]?.id}`
            }
            placeholder={!memberDetails[member]?.avatar}
            label="Avatar"
            address={memberDetails[member]?.ethAddress}
            size="7"
          />
          <Box marginLeft="2">
            <Text>{memberDetails[member]?.username}</Text>
          </Box>
        </Container>
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Box
        borderWidth="0.5"
        borderRadius="2xLarge"
        backgroundColor="backgroundSecondary"
        padding="6"
        width="76"
      >
        <Stack space="8">
          <Stack direction="horizontal" align="center">
            <Avatar
              src={
                memberDetails[member]?.avatar ||
                `https://api.dicebear.com/5.x/thumbs/svg?seed=${memberDetails[member]?.id}`
              }
              label=""
              placeholder={!memberDetails[member]?.avatar}
              address={memberDetails[member]?.ethAddress}
            />
            <Text size="extraLarge" weight="semiBold">
              {memberDetails[member]?.username}
            </Text>
          </Stack>
          <Stack direction="horizontal" wrap space="2">
            {userRoles?.map &&
              userRoles?.map((role) => (
                <Box
                  key={role}
                  cursor="pointer"
                  onClick={async () => {
                    // remove user role if at least one role is left
                    if (userRoles.length > 1) {
                      const newRoles = userRoles.filter((r) => r !== role);
                      setUserRoles(newRoles);
                      const data = await updateMemberRole(circle.id, member, {
                        roles: newRoles,
                      });
                      if (data) {
                        queryClient.setQueryData(["circle", cId], data);
                      }
                    }
                  }}
                >
                  <Tag hover tone="accent">
                    <Stack direction="horizontal" space="1" align="center">
                      <IconClose size="5" />
                      <Text>{role}</Text>
                    </Stack>
                  </Tag>
                </Box>
              ))}
            <Box cursor="pointer">
              <Popover
                width="fit"
                butttonComponent={
                  <Box
                    cursor="pointer"
                    onClick={() => setIsRolePopoverOpen(!isRolePopoverOpen)}
                  >
                    <Text variant="label">
                      <IconPlusSmall />
                    </Text>
                  </Box>
                }
                isOpen={isRolePopoverOpen}
                setIsOpen={setIsRolePopoverOpen}
              >
                <Box
                  backgroundColor="background"
                  borderRadius="2xLarge"
                  borderWidth="0.5"
                  ref={childRef}
                >
                  {Object.keys(circle.roles).map((role, index) => (
                    <RoleOption
                      key={role}
                      borderBottomWidth={
                        index === Object.keys(circle.roles).length - 1
                          ? "0"
                          : "0.375"
                      }
                      padding="4"
                      borderTopRadius={index === 0 ? "2xLarge" : "none"}
                      borderBottomRadius={
                        index === Object.keys(circle.roles).length - 1
                          ? "2xLarge"
                          : "none"
                      }
                      mode={mode}
                      onClick={async (e) => {
                        console.log("click");
                        if (userRoles && !userRoles.includes(role)) {
                          console.log("add role");
                          // add user role if not already present
                          const newUserRoles = [...userRoles, role];
                          setUserRoles(newUserRoles);
                          const data = await updateMemberRole(
                            circle.id,
                            member,
                            {
                              roles: newUserRoles,
                            }
                          );
                          if (data) {
                            queryClient.setQueryData(["circle", cId], data);
                          }
                        }
                        setIsRolePopoverOpen(false);
                      }}
                    >
                      <Text variant="label">{role}</Text>
                    </RoleOption>
                  ))}
                </Box>
              </Popover>
            </Box>
          </Stack>
          <PrimaryButton
            tone="red"
            icon={<IconClose />}
            onClick={async () => {
              const data = await removeMember(circle.id, member);
              if (data) {
                queryClient.setQueryData(["circle", cId], data);
              }
            }}
          >
            Remove Member
          </PrimaryButton>
        </Stack>
      </Box>
    </Popover>
  );
}
