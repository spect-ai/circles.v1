import { Box, Stack } from "degen";
import React from "react";
import FormRoles from "../FormRoles";

export default function Access() {
  return (
    <Stack>
      <Box width={{ lg: "1/2" }}>
        <FormRoles />
      </Box>
    </Stack>
  );
}
