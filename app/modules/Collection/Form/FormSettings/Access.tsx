import { Stack } from "degen";
import React from "react";
import RoleGate from "../../RoleGate";
import SybilResistance from "../../SybilResistance";

export default function Access() {
  return (
    <Stack>
      <RoleGate />
      <SybilResistance />
    </Stack>
  );
}
