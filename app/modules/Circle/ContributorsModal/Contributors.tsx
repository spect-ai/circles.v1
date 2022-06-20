import { MemberDetails } from "@/app/types";
import { Box, Heading, Stack } from "degen";
import React, { useState } from "react";
import styled from "styled-components";
import InviteMemberModal from "../InviteMembersModal";
import MemberDisplay from "./MemberDisplay";

type Props = {
  members: string[];
  memberDetails: MemberDetails;
  roles: { [key: string]: string };
};

function Contributors({ members, memberDetails, roles }: Props) {
  const [member, setMember] = useState<any>();
  const [anchorEl, setAnchorEl] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  const handleOnClick = (event: any, mem: string) => {
    setMember({
      id: mem,
      role: roles[mem],
    });
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  console.log({ members, roles, memberDetails });

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
                  handleOnClick={handleOnClick}
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
                  handleOnClick={handleOnClick}
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
                  handleOnClick={handleOnClick}
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
