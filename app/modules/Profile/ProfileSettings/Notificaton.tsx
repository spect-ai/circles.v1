import { Box, Stack, Text, Tag, Textarea, Input } from "degen";
import { skillsArray } from "../ProfilePage/constants";
import React from "react";

import { useProfile } from "./LocalProfileContext";
import { isEmail } from "@/app/common/utils/utils";

export function Notification() {
  const { setIsDirty, setEmail, email } = useProfile();
  return (
    <Stack>
      <Input
        label="Email"
        placeholder="Email"
        inputMode="email"
        type="email"
        error={email && !isEmail(email)}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setIsDirty(true);
        }}
      />
    </Stack>
  );
}
