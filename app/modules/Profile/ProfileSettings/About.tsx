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
      <Stack direction="horizontal" justify="space-between">
        <Text variant="label">Skills</Text>
        <Tag>Upto {10 - skills?.length}</Tag>
      </Stack>
      <Box
        display="flex"
        flexDirection="row"
        gap="1.5"
        flexWrap="wrap"
        marginBottom="2"
        justifyContent="center"
      >
        {skillsArray.map((skill) => (
          <Box
            onClick={() => {
              if (skills?.includes(skill)) {
                setSkills(skills?.filter((item) => item !== skill));
              } else if (skills?.length < 10) {
                setSkills([...skills, skill]);
              }
              setIsDirty(true);
            }}
            style={{
              cursor: "pointer",
            }}
            key={skill}
          >
            <Tag
              size="medium"
              hover
              tone={skills?.includes(skill) ? "accent" : "secondary"}
            >
              <Box display="flex" alignItems="center">
                {skill}
              </Box>
            </Tag>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
