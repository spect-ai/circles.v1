import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { CircleType, MemberDetails } from "@/app/types";
import { Box, Heading, Stack, Text } from "degen";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import InviteMemberModal from "./InviteMembersModal";
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

  if (!circle) {
    return <div>Loading...</div>;
  }

  console.log(circle.roles);

  const RoleSection = ({ roleName }: { roleName: string }) => {
    let isMemberThere = false;
    return (
      <Box>
        <Heading>{roleName}</Heading>
        <Box display="flex" flexWrap="wrap">
          {circle?.members.map((mem) => {
            // if no member has role keep track of it
            if (circle.memberRoles[mem]?.includes(roleName)) {
              isMemberThere = true;
              return (
                <MemberDisplay
                  key={mem}
                  member={mem}
                  memberDetails={memberDetails?.memberDetails}
                />
              );
            }
          })}
          {!isMemberThere && (
            <Box marginTop="4">
              <Text variant="label">No members have this role</Text>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box padding="2">
      <Box width="1/3">{canDo(["steward"]) && <InviteMemberModal />}</Box>
      <Stack>
        {Object.keys(circle?.roles).map((role) => (
          <RoleSection key={role} roleName={role} />
        ))}
      </Stack>
    </Box>
  );
}

export default Contributors;
