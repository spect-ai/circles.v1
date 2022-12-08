import { Stack } from "degen";
import React from "react";
import OpportunityMode from "../../OpportunityMode";
import SendKudos from "../../SendKudos";
import VotingModule from "../../VotingModule";
import CredentialCuration from "../CredentialCuration";

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
