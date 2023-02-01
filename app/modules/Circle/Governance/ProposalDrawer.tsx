import Drawer from "@/app/common/components/Drawer";
import { Box, Button, Heading, IconChevronRight, Stack, Tag } from "degen";
import { useRouter } from "next/router";
import SnapshotVoting from "../../Collection/Form/DataDrawer/VotingOnSnapshot";
import SpectVoting from "../../Collection/Form/DataDrawer/VotingOnSpect";
import { useQuery as useApolloQuery, gql } from "@apollo/client";
import Editor from "@/app/common/components/Editor";
import { useState } from "react";
import Loader from "@/app/common/components/Loader";
import styled from "styled-components";
import { CollectionType } from "@/app/types";
import { getBodyOfProposal } from "../../Collection/Form/DataDrawer/VotingActions";
import { useLocation } from "react-use";

interface ProposalDrawerProps {
  handleClose: () => void;
  proposalId: string;
  collection?: CollectionType;
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
  collection,
}: ProposalDrawerProps) {
  const { push, pathname, query } = useRouter();
  const { hostname } = useLocation();
  const [showDescription, setShowDescription] = useState(false);
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

  const body =
    collection?.id &&
    getBodyOfProposal(
      collection as CollectionType,
      collection?.data?.[proposalId],
      hostname as string,
      query.circle as string,
      proposalId
    );

  return (
    <Box>
      <Loader loading={proposalLoading} text="Fetching Data from Snapshot..." />
      <Drawer
        width="50%"
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
        {proposalData && !collection?.id && proposalId.startsWith("0x") ? (
          <ScrollContainer>
            <Heading wordBreak="break-word">
              {proposalData?.proposal?.title}
            </Heading>
            <Box
              onClick={() => {
                setShowDescription(!showDescription);
              }}
              style={{
                cursor: "pointer",
                margin: "1rem 0rem",
                width: "fit-content",
              }}
            >
              <Tag tone="accent">
                {showDescription ? "Hide" : "Show"} Proposal
              </Tag>
            </Box>
            {showDescription && (
              <Editor
                value={proposalData?.proposal?.body as string}
                disabled={true}
              />
            )}
            <SnapshotVoting proposalId={proposalId} />
          </ScrollContainer>
        ) : (
          <ScrollContainer>
            <Heading wordBreak="break-word">
              {collection?.data?.[proposalId]?.["Title"] || collection?.name}
            </Heading>
            <Box
              onClick={() => {
                setShowDescription(!showDescription);
              }}
              style={{
                cursor: "pointer",
                margin: "1rem 0rem",
                width: "fit-content",
              }}
            >
              <Tag tone="accent">
                {showDescription ? "Hide" : "Show"} Proposal
              </Tag>
            </Box>
            {showDescription && (
              <Editor value={body as string} disabled={true} />
            )}
            {collection && <SpectVoting dataId={proposalId} col={collection} />}
          </ScrollContainer>
        )}
      </Drawer>
    </Box>
  );
}
