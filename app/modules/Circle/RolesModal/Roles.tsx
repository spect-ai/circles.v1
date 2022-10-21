import { Box, IconSearch, IconUserSolid, Input, Stack, Text } from "degen";
import { matchSorter } from "match-sorter";
import AddRole from "../ContributorsModal/AddRoleModal";

import React, { useState } from "react";
import { useCircle } from "../CircleContext";
import GuildRoleMapping from "../CircleSettingsModal/GuildIntegration/GuildRoleMapping";
import DiscordRoleMapping from "../CircleSettingsModal/DiscordRoleMapping";

export default function Roles() {
  const { circle } = useCircle();
  const [roles, setRoles] = useState(Object.keys(circle?.roles || {}) || []);

  return (
    <Box padding="8">
      <Stack>
        <Input
          label=""
          prefix={<IconSearch />}
          placeholder="Search"
          onChange={(e) => {
            setRoles(
              matchSorter(Object.keys(circle?.roles || {}), e.target.value)
            );
          }}
        />
        <Stack direction="horizontal">
          <Box width="1/3">
            <AddRole />
          </Box>
          <Box width="1/3">
            <GuildRoleMapping />
          </Box>
          <Box width="1/3">
            <DiscordRoleMapping />
          </Box>
        </Stack>
        {circle &&
          roles.map((role) => (
            <Box key={role}>
              <Stack direction="horizontal" align="center">
                <Box width="1/3">
                  <Text variant="label">{role}</Text>
                </Box>
                <Box width="1/3">
                  <Text>
                    <Stack direction="horizontal" space="1" align="center">
                      {Object.values(circle.memberRoles).reduce(
                        (acc, memberRole) => {
                          if (memberRole.includes(role)) {
                            return acc + 1;
                          }
                          return acc;
                        },
                        0
                      )}
                      <IconUserSolid size="5" />
                    </Stack>
                  </Text>
                </Box>
                <Box width="1/4">
                  <AddRole role={role} />
                </Box>
              </Stack>
            </Box>
          ))}
      </Stack>
    </Box>
  );
}
