import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { CircleType, MemberDetails } from "@/app/types";
import { Box, Heading, Stack } from "degen";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import InviteMemberModal from "../InviteMembersModal";
import MemberDisplay from "./MemberDisplay";

function Contributors() {
  const { canDo } = useRoleGate();

  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  return (
    <Box padding="2">
      {canDo(["steward"]) && <InviteMemberModal />}
      <Stack>
        <Heading>Stewards</Heading>
        <Box display="flex" flexWrap="wrap">
          {circle?.members.map((mem) => {
            if (circle.memberRoles[mem]?.includes("steward")) {
              return (
                <MemberDisplay
                  key={mem}
                  member={mem}
                  memberDetails={memberDetails?.memberDetails}
                />
              );
            }
          })}
        </Box>
        <Heading>Contributors</Heading>
        <Box display="flex" flexWrap="wrap">
          {circle?.members.map((mem) => {
            if (circle.memberRoles[mem]?.includes("contributor")) {
              return (
                <MemberDisplay
                  key={mem}
                  member={mem}
                  memberDetails={memberDetails?.memberDetails}
                />
              );
            }
          })}
        </Box>
        <Heading>Members</Heading>
        <Box display="flex" flexWrap="wrap">
          {circle?.members.map((mem) => {
            if (circle.memberRoles[mem]?.includes("member")) {
              return (
                <MemberDisplay
                  key={mem}
                  member={mem}
                  memberDetails={memberDetails?.memberDetails}
                />
              );
            }
          })}
        </Box>
      </Stack>
    </Box>
  );
}

export default Contributors;
