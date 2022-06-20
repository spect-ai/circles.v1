import { UserType } from "@/app/types";
import { Box, Heading, Stack } from "degen";
import React from "react";
import InviteMemberModal from "../InviteMembersModal";
import MemberDisplay from "./MemberDisplay";

type Props = {
  members: string[];
  memberDetails: {
    [key: string]: UserType;
  };
  roles: { [key: string]: string };
};

function Contributors({ members, memberDetails, roles }: Props) {
  return (
    <Box padding="2">
      <InviteMemberModal />
      <Stack>
        <Heading>Stewards</Heading>
        <Box display="flex" flexWrap="wrap">
          {members?.map((mem) => {
            if (roles[mem].includes("steward")) {
              return (
                <MemberDisplay
                  key={mem}
                  member={mem}
                  memberDetails={memberDetails}
                />
              );
            }
          })}
        </Box>
        <Heading>Contributors</Heading>
        <Box display="flex" flexWrap="wrap">
          {members?.map((mem) => {
            if (roles[mem].includes("contributor")) {
              return (
                <MemberDisplay
                  key={mem}
                  member={mem}
                  memberDetails={memberDetails}
                />
              );
            }
          })}
        </Box>
        <Heading>Members</Heading>
        <Box display="flex" flexWrap="wrap">
          {members?.map((mem) => {
            if (roles[mem].includes("member")) {
              return (
                <MemberDisplay
                  key={mem}
                  member={mem}
                  memberDetails={memberDetails}
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
