import PrimaryButton from "@/app/common/components/PrimaryButton";
import queryClient from "@/app/common/utils/queryClient";
import { useGlobal } from "@/app/context/globalContext";
import { joinCircleFromDiscord } from "@/app/services/JoinCircle";
import { CircleType, MemberDetails, UserType } from "@/app/types";
import { Box, Heading, IconSearch, Input, Stack, Text } from "degen";
import { matchSorter } from "match-sorter";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Tooltip } from "react-tippy";
import MemberDisplay from "./ContributorsModal/MemberDisplay";

function CircleMembers() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  const { data: memberDetails, refetch: fetchMemberDetails } =
    useQuery<MemberDetails>(["memberDetails", cId], {
      enabled: false,
    });

  const { connectedUser } = useGlobal();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const [filteredMembers, setFilteredMembers] = useState<
    { name: string; id: string }[]
  >([] as any);
  const [circleMembers, setCircleMembers] = useState<
    {
      name: string;
      id: string;
    }[]
  >([] as any);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (circle) {
      const circleMembersArray = circle?.members.map((mem) => ({
        name: memberDetails?.memberDetails[mem]?.username as string,
        id: mem,
      }));
      setFilteredMembers(circleMembersArray);
      setCircleMembers(circleMembersArray);
    }
  }, [circle, memberDetails?.memberDetails]);

  const RoleSection: React.FC<{ roleName: string }> = ({ roleName }) => {
    const [memberPresent, setMemberPresent] = useState(false);
    return (
      <Box>
        {memberPresent && <Text variant="label">{`${roleName}s`}</Text>}
        <Stack direction="horizontal" wrap>
          {filteredMembers.map((mem) => {
            if (circle?.memberRoles[mem.id]?.includes(roleName)) {
              !memberPresent && setMemberPresent(true);
              return (
                <MemberDisplay
                  key={mem.id}
                  member={mem.id}
                  memberDetails={memberDetails?.memberDetails}
                />
              );
            }
          })}
        </Stack>
      </Box>
    );
  };
  if (!circle) {
    return <div>Loading...</div>;
  }

  return (
    <Box marginRight="8">
      <Stack>
        <Heading>Members</Heading>
        {!circle.members.includes(connectedUser) &&
          circle.discordGuildId &&
          currentUser?.discordId && (
            <Tooltip title="You can join circle if you have an eligible discord role">
              <PrimaryButton
                loading={loading}
                onClick={async () => {
                  setLoading(true);
                  const data = await joinCircleFromDiscord(circle.id);
                  if (data) {
                    queryClient.setQueryData(["circle", cId], data);
                    await fetchMemberDetails();
                  }
                  setLoading(false);
                }}
              >
                Join Circle
              </PrimaryButton>
            </Tooltip>
          )}
        <Input
          label=""
          placeholder="Search members"
          prefix={<IconSearch />}
          onChange={(e) => {
            setFilteredMembers(
              matchSorter(circleMembers, e.target.value, {
                keys: ["name"],
              })
            );
          }}
        />
        {Object.keys(circle?.roles).map((role) => (
          <RoleSection key={role} roleName={role} />
        ))}
      </Stack>
    </Box>
  );
}

export default CircleMembers;
