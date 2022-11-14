import { Box, Stack, Text, Tag, Textarea } from "degen";
import { skillsArray } from "../ProfilePage/constants";
import React from "react";

import { useProfile } from "./LocalProfileContext";

export function About() {
  const { bio, setBio, setIsDirty, skills, setSkills } = useProfile();
  return (
    <Stack>
      <Stack direction="horizontal" justify="space-between">
        <Text variant="label">Bio</Text>
        <Tag>{100 - bio?.length}</Tag>
      </Stack>
      <Textarea
        label
        hideLabel
        maxLength={100}
        rows={2}
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
