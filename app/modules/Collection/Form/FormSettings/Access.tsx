import { Box, Stack } from "degen";
import React from "react";
import RoleGate from "../../RoleGate";
import SybilResistance from "../../SybilResistance";
import FormRoles from "../FormRoles";

export default function Access() {
  return (
    <Stack>
      <RoleGate />
      <SybilResistance />
      <Box width={{ lg: "1/2" }}>
        <FormRoles />
      </Box>
    </Stack>
  );
}
