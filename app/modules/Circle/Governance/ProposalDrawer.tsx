import Drawer from "@/app/common/components/Drawer";
import { Box, Button, Heading, IconChevronRight, Stack, Tag } from "degen";
import { useRouter } from "next/router";
import SnapshotVoting from "../../Collection/Form/DataDrawer/VotingOnSnapshot";
import { useQuery as useApolloQuery, gql } from "@apollo/client";
import Editor from "@/app/common/components/Editor";
import Loader from "@/app/common/components/Loader";
import styled from "styled-components";

interface ProposalDrawerProps {
  handleClose: () => void;
  proposalId: string;
}

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: 90vh;
  margin: 0.5rem 2rem;
`;

export const Proposal = gql`
  query Proposal($proposal: String!) {
    proposal(id: $proposal) {
      id
      title
      end
      snapshot
      state
      body
      choices
    }
  }
`;

export default function ProposalDrawer({
  handleClose,
  proposalId,
}: ProposalDrawerProps) {
  const { push, pathname, query } = useRouter();
  const closeCard = () => {
    void push({
      pathname,
      query: {
        circle: query.circle,
        tab: query.tab,
        proposalStatus: query.proposalStatus,
      },
    });
    handleClose();
  };

  const { data: proposalData, loading: proposalLoading } = useApolloQuery(
    Proposal,
    {
      variables: { proposal: proposalId },
    }
  );

  return (
    <Box>
      <Loader loading={proposalLoading} text="Fetching Data from Snapshot..." />
      <Drawer
        width="75%"
        handleClose={() => {
          handleClose();
        }}
        header={
          <Box marginLeft="-4">
            <Stack
              direction="horizontal"
              align="center"
              justify="space-between"
            >
              <Button
                shape="circle"
                size="small"
                variant="transparent"
                onClick={() => {
                  closeCard();
                }}
              >
                <Stack direction="horizontal" align="center" space="0">
                  <IconChevronRight />
                  <Box marginLeft="-4">
                    <IconChevronRight />
                  </Box>
                </Stack>
              </Button>
              <Box width="56"></Box>
            </Stack>
          </Box>
        }
      >
        {proposalData && (
          <ScrollContainer>
            <Stack space="2" direction={"horizontal"} align="flex-start" justify={"space-between"}>
              <Stack space="8">
                <Heading wordBreak="break-word">
                  {proposalData?.proposal?.title}
                </Heading>
                <Editor
                  value={proposalData?.proposal?.body as string}
                  disabled={true}
                />
              </Stack>

              <Box width={"96"}>
                <SnapshotVoting proposalId={proposalId} />
              </Box>
            </Stack>
          </ScrollContainer>
        )}
      </Drawer>
    </Box>
  );
}
