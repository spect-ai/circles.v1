import { Stack, Text, Input } from "degen";
import React from "react";
import { isEmail } from "@/app/common/utils/utils";

import { useProfile } from "./LocalProfileContext";

const Notification = () => {
  const { setIsDirty, setEmail, email } = useProfile();
  return (
    <Stack>
      <Text variant="label">Email</Text>
      <Input
        label
        hideLabel
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
};

export default Notification;
