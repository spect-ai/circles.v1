import { Stack, Text, Tag, Textarea } from "degen";

import { useProfile } from "./LocalProfileContext";

const About = () => {
  const { bio, setBio, setIsDirty } = useProfile();
  return (
    <Stack>
      <Stack direction="horizontal" justify="space-between">
        <Text variant="label">Bio</Text>
        {bio && <Tag>{100 - bio.length}</Tag>}
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
};

export default About;
