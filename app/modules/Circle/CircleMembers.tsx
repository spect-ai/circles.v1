import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import {
  joinCircleFromDiscord,
  joinCircleFromGuildxyz,
} from "@/app/services/JoinCircle";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { UserType } from "@/app/types";
import { Box, IconSearch, Input, Stack, useTheme } from "degen";
import { matchSorter } from "match-sorter";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Tooltip } from "react-tippy";
import { useCircle } from "./CircleContext";
import InviteMemberModal from "./ContributorsModal/InviteMembersModal";
import ContributorTable from "./ContributorTable";

function CircleMembers() {
  const { circle, memberDetails, setCircleData, fetchMemberDetails } =
    useCircle();
  const { connectedUser } = useGlobal();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const { canDo } = useRoleGate();

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
  const { mode } = useTheme();

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

  if (!circle) {
    return <div>Loading...</div>;
  }

  return (
    <Stack>
      <Stack
        direction={{
          xs: "vertical",
          md: "horizontal",
        }}
        align="center"
      >
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
        {!circle.members.includes(connectedUser) &&
          circle.discordGuildId &&
          currentUser?.discordId && (
            <Tooltip
              title="You can join circle if you have an eligible discord role"
              theme={mode}
              position="top"
            >
              <PrimaryButton
                loading={loading}
                onClick={async () => {
                  setLoading(true);
                  const data = await joinCircleFromDiscord(circle.id);
                  if (data) {
                    setCircleData(data);
                    fetchMemberDetails();
                  }
                  setLoading(false);
                }}
              >
                Join Circle
              </PrimaryButton>
            </Tooltip>
          )}
        {!circle.members.includes(connectedUser) && circle.guildxyzId && (
          <Tooltip
            title="You can join circle if you have an eligible guildxyz role"
            theme={mode}
            position="top"
          >
            <PrimaryButton
              loading={loading}
              onClick={async () => {
                setLoading(true);
                const data = await joinCircleFromGuildxyz(circle.id);
                if (data) {
                  setCircleData(data);
                  fetchMemberDetails();
                }
                setLoading(false);
              }}
            >
              Join Circle
            </PrimaryButton>
          </Tooltip>
        )}
        {canDo("inviteMembers") && (
          <Box
            width={{
              xs: "full",
              md: "1/3",
            }}
            marginTop="2"
          >
            <InviteMemberModal />
          </Box>
        )}
      </Stack>
      <ContributorTable filteredMembers={filteredMembers} />
    </Stack>
  );
}

export default CircleMembers;
