import { Stack } from "degen";
import React from "react";
import SendKudos from "../../SendKudos";
import VotingModule from "../../VotingModule";

export default function Curation() {
  return (
    <Stack>
      {/* <CredentialCuration /> */}
      <VotingModule />

      <SendKudos />

      {/* <OpportunityMode /> */}
    </Stack>
  );
}
