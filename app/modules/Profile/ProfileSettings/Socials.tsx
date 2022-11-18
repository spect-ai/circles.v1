import { Input, Stack, Text } from "degen";

import { useProfile } from "./LocalProfileContext";

export function Socials() {
  const {
    setIsDirty,
    twitter,
    github,
    behance,
    website,
    setTwitter,
    setGithub,
    setBehance,
    setWebsite,
  } = useProfile();
  return (
    <Stack>
      <Text variant="label">Twitter</Text>
      <Input
        label
        hideLabel
        placeholder="https://twitter.com/owocki"
        inputMode="url"
        value={twitter}
        onChange={(e) => {
          setTwitter(e.target.value);
        }}
      />
      <Text variant="label">Github</Text>
      <Input
        label
        hideLabel
        placeholder="https://github.com/geohot"
        inputMode="url"
        value={github}
        onChange={(e) => {
          setGithub(e.target.value);
        }}
      />{" "}
      <Text variant="label">Behance</Text>
      <Input
        label
        hideLabel
        placeholder="https://www.behance.net/kindredstudio"
        inputMode="url"
        value={behance}
        onChange={(e) => {
          setBehance(e.target.value);
        }}
      />{" "}
      <Text variant="label">Website</Text>
      <Input
        label
        hideLabel
        placeholder="https://ethereum.org"
        inputMode="url"
        value={website}
        onChange={(e) => {
          setWebsite(e.target.value);
        }}
      />
    </Stack>
  );
}
