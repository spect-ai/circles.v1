import {
  Box,
  Button,
  IconLightningBolt,
  Stack,
  Tag,
  Text,
  useTheme,
} from "degen";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import GovernanceHeading from "./GovernanceHeading";
import { useQuery as useApolloQuery, gql } from "@apollo/client";
import { useCircle } from "../CircleContext";
import styled from "styled-components";
import { Col, Row } from "react-grid-system";
import ClickableAvatar from "@/app/common/components/Avatar";
import Loader from "@/app/common/components/Loader";
import Link from "next/link";
import ProposalDrawer from "./ProposalDrawer";

export default function Governance() {
  const { mode } = useTheme();
  const router = useRouter();
  const { circle: cId, proposalStatus, proposalHash } = router.query;
  const [status, setStatus] = useState(proposalStatus);
  const { localCircle: circle, memberDetails } = useCircle();
  const { loading: isLoading, data: activeProposals } = useApolloQuery(
    Proposals,
    {
      variables: { state: "active", space: circle?.snapshot?.id },
    }
  );

  const { loading: loading, data: closedProposals } = useApolloQuery(
    Proposals,
    {
      variables: { state: "closed", space: circle?.snapshot?.id },
    }
  );
  const [proposals, setProposals] = useState<any>(
    [] || activeProposals?.proposals
  );
  const [proposalId, setProposalId] = useState<string>(
    (proposalHash as string) || ""
  );
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  function getAuthorDetails(auth: string) {
    const author =
      memberDetails &&
      Object.values(memberDetails?.memberDetails)?.find(
        (member) => member?.ethAddress?.toLowerCase() === auth?.toLowerCase()
      );
    return author;
  }

  useEffect(() => {
    if (status === "Active") {
      setProposals(activeProposals?.proposals);
    } else if (status === "Completed") {
      setProposals(closedProposals?.proposals);
    }
  }, [status]);

  useEffect(() => {
    if (proposalHash) {
      setOpenDrawer(true);
    }
  }, [proposalHash]);

  return (
    <>
      <ToastContainer
        toastStyle={{
          backgroundColor: `${
            mode === "dark" ? "rgb(20,20,20)" : "rgb(240,240,240)"
          }`,
          color: `${
            mode === "dark" ? "rgb(255,255,255,0.7)" : "rgb(20,20,20,0.7)"
          }`,
        }}
      />
      <Loader
        loading={isLoading || loading}
        text="Fetching some thanos level data ..."
      />
      {openDrawer && (
        <ProposalDrawer
          proposalId={proposalId}
          handleClose={() => setOpenDrawer(false)}
        />
      )}
      <GovernanceHeading status={status as string} setStatus={setStatus} />
      <ScrollContainer>
        <Row id="row">
          {!loading &&
            !isLoading &&
            proposals?.length > 0 &&
            proposals?.map((proposal: any) => {
              const author = getAuthorDetails(proposal.author);
              return (
                <Col md={5} style={{ padding: "0rem", marginLeft: "1rem" }}>
                  <Link
                    href={`/${cId}?tab=governance&proposalStatus=${status}&proposalHash=${proposal.id}`}
                  >
                    <Container
                      mode={mode}
                      onClick={() => {
                        setProposalId(proposal.id);
                        setOpenDrawer(true);
                      }}
                    >
                      <Stack direction={"horizontal"} justify="space-between">
                        <ClickableAvatar
                          username={author?.username || "Fren"}
                          userId={author?.id || ""}
                          label={""}
                          src={author?.avatar || "0x0"}
                          size="6"
                        />
                        <Tag hover tone="accent">
                          Snapshot
                        </Tag>
                      </Stack>
                      <Text
                        variant="large"
                        color="textPrimary"
                        align="left"
                        weight={"semiBold"}
                        ellipsis
                      >
                        {proposal.title}
                      </Text>
                      <Stack direction={"horizontal"} justify="flex-end">
                        <Tag hover>
                          Started on{" "}
                          {new Date(proposal.start * 1000).toDateString()}
                        </Tag>
                      </Stack>
                    </Container>
                  </Link>
                </Col>
              );
            })}
          {(!proposals || proposals?.length === 0) && (
            <Box
              style={{
                margin: "20% 40%",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <Button shape="circle" variant="secondary" size="large">
                <IconLightningBolt size={"8"} />
              </Button>
              <Text
                variant="large"
                color="accent"
                align="left"
                weight={"semiBold"}
                ellipsis
              >
                No {proposalStatus} proposals
              </Text>
            </Box>
          )}
        </Row>
      </ScrollContainer>
    </>
  );
}

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 9rem);
  margin: 1rem 3rem;
`;

const Container = styled(Box)<{ mode: string }>`
  border-width: 2px;
  border-radius: 0.5rem;
  border-color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.05)" : "rgb(20,20,20,0.05)"};
  };
  &:hover {
    border-color: ${(props) =>
      props.mode === "dark" ? "rgb(255, 255, 255, 0.1)" : "rgb(20,20,20,0.1)"};
  }
  color: rgb(191, 90, 242, 0.7);
  padding: 1rem;
  margin-bottom: 0.5rem;
  height: 8rem;
  width: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Proposals = gql`
  query Proposals($state: String!, $space: String!) {
    proposals(
      first: 20
      skip: 0
      where: { space_in: [$space], state: $state }
      orderBy: "created"
      orderDirection: desc
    ) {
      id
      title
      start
      end
      author
    }
  }
`;
