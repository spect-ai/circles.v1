import { Input, Stack, Text } from "degen";
import { useState } from "react";

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

  const [isInvalidValue, setIsInvalidValue] = useState({
    twitter: false,
    github: false,
    behance: false,
    website: false,
  });

  const isInvalid = (fieldName: string, value: any) => {
    switch (fieldName) {
      case "twitter":
        return value.length > 0 && !value.startsWith("https://twitter.com/");
      case "github":
        return value.length > 0 && !value.startsWith("https://github.com/");
      case "behance":
        return (
          value.length > 0 && !value.startsWith("https://www.behance.net/")
        );
      case "website":
        return (
          value.length > 0 &&
          !value.startsWith("https://") &&
          !value.startsWith("http://")
        );
      default:
        return false;
    }
  };

  return (
    <Stack>
      <Input
        label="Twitter"
        placeholder="https://twitter.com/owocki"
        inputMode="url"
        value={twitter}
        onChange={(e) => {
          setIsDirty(true);
          const invalid = isInvalid("twitter", e.target.value);
          setIsInvalidValue({
            ...isInvalidValue,
            twitter: invalid,
          });
          setTwitter(e.target.value);
          if (invalid) {
            setIsDirty(false);
          }
        }}
      />
      {isInvalidValue.twitter && (
        <Text variant="small" color="red">
          Invalid Twitter URL, must start with https://twitter.com/
        </Text>
      )}
      <Input
        label="Github"
        placeholder="https://github.com/geohot"
        inputMode="url"
        value={github}
        onChange={(e) => {
          setIsDirty(true);
          const invalid = isInvalid("github", e.target.value);
          setIsInvalidValue({
            ...isInvalidValue,
            github: invalid,
          });
          setGithub(e.target.value);
          if (invalid) {
            setIsDirty(false);
          }
        }}
      />{" "}
      {isInvalidValue.github && (
        <Text variant="small" color="red">
          Invalid Github URL, must start with https://github.com/
        </Text>
      )}
      <Input
        label="Behance"
        placeholder="https://www.behance.net/kindredstudio"
        inputMode="url"
        value={behance}
        onChange={(e) => {
          setIsDirty(true);
          const invalid = isInvalid("behance", e.target.value);
          setIsInvalidValue({
            ...isInvalidValue,
            behance: invalid,
          });
          setBehance(e.target.value);
          if (invalid) {
            setIsDirty(false);
          }
        }}
      />{" "}
      {isInvalidValue.behance && (
        <Text variant="small" color="red">
          Invalid Behance URL, must start with https://www.behance.net/
        </Text>
      )}
      <Input
        label="Website"
        placeholder="https://ethereum.org"
        inputMode="url"
        value={website}
        onChange={(e) => {
          setIsDirty(true);
          const invalid = isInvalid("website", e.target.value);
          setIsInvalidValue({
            ...isInvalidValue,
            website: invalid,
          });
          setWebsite(e.target.value);
          if (invalid) {
            setIsDirty(false);
          }
        }}
      />
      {isInvalidValue.website && (
        <Text variant="small" color="red">
          Invalid website URL, Must start with https:// or http://
        </Text>
      )}
    </Stack>
  );
}
