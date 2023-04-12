import { Box, Input, IconSearch, Stack } from "degen";
import { useCircle } from "../CircleContext";
import Loader from "@/app/common/components/Loader";

import { matchSorter } from "match-sorter";
import React, { useState, useEffect } from "react";
import InviteMemberModal from "../ContributorsModal/InviteMembersModal";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import AddRole from "../ContributorsModal/AddRoleModal";
import GuildRoleMapping from "../CircleSettingsModal/GuildIntegration/GuildRoleMapping";
import DiscordRoleMapping from "../CircleSettingsModal/DiscordRoleMapping";
import RoleCard from "./RolesCard";
import { Row, Col, Hidden, Visible } from "react-grid-system";
import { useRouter } from "next/router";
import styled from "styled-components";
import { isSidebarExpandedAtom } from "@/app/state/global";
import { useAtom } from "jotai";

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 13rem);
`;

function Roles() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { circle, loading, isLoading } = useCircle();
  const [isSidebarExpanded, setIsSidebarExpanded] = useAtom(
    isSidebarExpandedAtom
  );
  const { canDo } = useRoleGate();
  const [circleRoles, setCircleRoles] = useState(circle?.roles || {});
  useEffect(() => {
    setCircleRoles(circle?.roles || {});
  }, [cId, circle?.roles]);

  if (isLoading || !circle || loading) {
    return <Loader text="...." loading />;
  }

  return (
    <Stack
      space={{
        xs: "0",
        md: "4",
      }}
    >
      <Stack
        direction={{
          xs: "vertical",
          md: "horizontal",
        }}
        align="center"
      >
        <Input
          label=""
          placeholder="Search roles"
          prefix={<IconSearch />}
          onChange={(e) => {
            const roles = matchSorter(
              Object.values(circle?.roles),
              e.target.value,
              {
                keys: ["name"],
              }
            );
            setCircleRoles(
              roles.reduce((rest, p) => ({ ...rest, [p.name]: p }), {})
            );
          }}
        />
        {canDo("inviteMembers") && (
          <Box
            width={{
              xs: "full",
              md: "1/3",
            }}
            marginBottom="1"
          >
            <InviteMemberModal />
          </Box>
        )}
      </Stack>
      <Hidden xs sm>
        {canDo("manageRoles") && (
          <Stack
            direction={{
              xs: "vertical",
              md: "horizontal",
            }}
          >
            <Box
              width={{
                xs: "full",
                md: "1/3",
              }}
            >
              <AddRole />
            </Box>
            <Box
              width={{
                xs: "full",
                md: "1/3",
              }}
            >
              <GuildRoleMapping />
            </Box>
            <Box
              width={{
                xs: "full",
                md: "1/3",
              }}
            >
              <DiscordRoleMapping />
            </Box>
          </Stack>
        )}
      </Hidden>
      <ScrollContainer
        style={{
          marginLeft: isSidebarExpanded ? "0px" : "0rem",
          alignItems: "center",
          paddingTop: "1rem",
        }}
        id="scroll"
      >
        <Row id="row">
          {circle?.roles &&
            Object.keys(circleRoles)?.map((roleKey) => {
              const role = circleRoles?.[roleKey];
              return (
                <Col sm={12} md={6} lg={4} key={roleKey} id="col">
                  <RoleCard roleKey={roleKey} role={role} />
                </Col>
              );
            })}
        </Row>
        <Visible xs sm>
          {canDo("manageRoles") && (
            <Stack
              direction={{
                xs: "vertical",
                md: "horizontal",
              }}
            >
              <Box
                width={{
                  xs: "full",
                  md: "1/3",
                }}
              >
                <AddRole />
              </Box>
              <Box
                width={{
                  xs: "full",
                  md: "1/3",
                }}
              >
                <GuildRoleMapping />
              </Box>
              <Box
                width={{
                  xs: "full",
                  md: "1/3",
                }}
              >
                <DiscordRoleMapping />
              </Box>
            </Stack>
          )}
        </Visible>
      </ScrollContainer>
    </Stack>
  );
}

export default Roles;
