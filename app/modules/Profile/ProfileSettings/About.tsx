import { Box, Stack, Text, Tag, Textarea } from "degen";
import React from "react";

import { useProfile } from "./LocalProfileContext";

export function About() {
  const { bio, setBio, setIsDirty } = useProfile();
  return (
    <Stack space="0">
      <Stack direction="horizontal" justify="space-between">
        <Box marginLeft="4">
          <Text size="small" weight="semiBold" color="textSecondary">
            Bio
          </Text>
        </Box>
        <Tag>{100 - bio?.length}</Tag>
      </Stack>
      <Textarea
        label
        hideLabel
        maxLength={100}
        rows={3}
        placeholder="About you under 100 characters"
        value={bio}
        onChange={(e) => {
          setBio(e.target.value);
          setIsDirty(true);
        }}
      />
    </Stack>
  );
}
