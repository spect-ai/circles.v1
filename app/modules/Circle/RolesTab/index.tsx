import { Box, Input, IconSearch } from "degen";
import { useCircle } from "../CircleContext";
import { useGlobal } from "@/app/context/globalContext";
import Loader from "@/app/common/components/Loader";

import { matchSorter } from "match-sorter";
import React, { useState, useEffect } from "react";
import InviteMemberModal from "../ContributorsModal/InviteMembersModal";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import AddRole from "../ContributorsModal/AddRoleModal";
import GuildRoleMapping from "../CircleSettingsModal/GuildIntegration/GuildRoleMapping";
import DiscordRoleMapping from "../CircleSettingsModal/DiscordRoleMapping";
import RoleCard from "./RolesCard";
import { Container as GridContainer, Row, Col } from "react-grid-system";
import { useRouter } from "next/router";
import styled from "styled-components";

const ScrollContainer = styled(GridContainer)`
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
  const { localCircle: circle, loading, isLoading } = useCircle();
  const { isSidebarExpanded } = useGlobal();
  const { canDo } = useRoleGate();
  const [circleRoles, setCircleRoles] = useState(circle?.roles || {});
  useEffect(() => {
    setCircleRoles(circle?.roles || {});
  }, [cId, circle?.roles]);

  if (isLoading || !circle || loading) {
    return <Loader text="...." loading />;
  }

  return (
    <Box>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          gap: "1rem",
        }}
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
          <Box width={"1/3"} marginBottom="1">
            <InviteMemberModal />
          </Box>
        )}
      </Box>
      {canDo("manageRoles") && (
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            gap: "0.5rem",
            paddingTop: "1rem",
          }}
        >
          <Box width="1/3">
            <AddRole />
          </Box>
          <Box width="1/3">
            <GuildRoleMapping />
          </Box>
          <Box width="1/3">
            <DiscordRoleMapping />
          </Box>
        </Box>
      )}
      <ScrollContainer
        style={{
          marginLeft: isSidebarExpanded ? "0px" : "8rem",
          alignItems: "center",
          paddingTop: "1rem",
        }}
      >
        <Row gutterWidth={10}>
          {circle?.roles &&
            Object.values(circleRoles)?.map((role) => {
              return (
                <Col key={role.role} lg={6}>
                  <RoleCard role={role} />
                </Col>
              );
            })}
        </Row>
      </ScrollContainer>
    </Box>
  );
}

export default Roles;
