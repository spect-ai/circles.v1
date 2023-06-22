import { Box, IconSearch, IconUserSolid, Input, Stack, Text } from "degen";
import { matchSorter } from "match-sorter";
import AddRole from "../ContributorsModal/AddRoleModal";

import React, { useEffect, useState } from "react";
import { useCircle } from "../CircleContext";
import GuildRoleMapping from "../CircleSettingsModal/GuildIntegration/GuildRoleMapping";
import DiscordRoleMapping from "../CircleSettingsModal/DiscordRoleMapping";
import { reservedRoles } from "../ContributorsModal/InviteMembersModal/constants";

export default function Roles() {
  const { circle } = useCircle();
  const [roles, setRoles] = useState(Object.keys(circle?.roles || {}) || []);

  useEffect(() => {
    setRoles(Object.keys(circle?.roles || {}) || []);
  }, [circle?.roles]);

  return (
    <Box
      paddingX={{
        xs: "2",
        md: "8",
      }}
      paddingY="4"
    >
      <Stack>
        <Stack
          direction={{
            xs: "vertical",
            md: "horizontal",
          }}
          space="4"
        >
          <Box
            width={{
              xs: "full",
              md: "56",
            }}
          >
            <AddRole />
          </Box>
          <Box
            width={{
              xs: "full",
              md: "56",
            }}
          >
            <GuildRoleMapping />
          </Box>
          <Box
            width={{
              xs: "full",
              md: "56",
            }}
          >
            <DiscordRoleMapping />
          </Box>
        </Stack>
        <Text variant="label">
          Role holders can only invite others with the same or lower role.
        </Text>
        {circle &&
          roles.map((role, index) => {
            if (reservedRoles.includes(role)) return null;
            return (
              <Box key={role}>
                <Stack direction="horizontal" align="center">
                  <Box width="1/3">
                    <Text variant="label">{circle.roles[role].name}</Text>
                  </Box>
                  <Box width="1/4">
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
                  <Box width="1/2">
                    <AddRole role={role} />
                  </Box>
                </Stack>
              </Box>
            );
          })}
      </Stack>
    </Box>
  );
}
