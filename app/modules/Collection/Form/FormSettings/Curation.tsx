import { Box, Stack } from "degen";
import React from "react";
import SendKudos from "../../SendKudos";
import VotingModule from "../../VotingModule";

export default function Curation() {
  return (
    <Stack>
      {/* <CredentialCuration /> */}
      {/* <Box
        width={{
          xs: "full",
          md: "1/2",
        }}
      >
        <VotingModule />
      </Box> */}

      <SendKudos />

      {/* <OpportunityMode /> */}
    </Stack>
  );
}
