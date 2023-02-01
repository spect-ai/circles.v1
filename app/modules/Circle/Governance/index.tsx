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
import { ThunderboltFilled } from "@ant-design/icons";
import Link from "next/link";
import ProposalDrawer from "./ProposalDrawer";
import { CollectionType, MappedItem, VotingPeriod } from "@/app/types";
import { useQuery } from "react-query";

interface Period {
  id: string;
  title: any;
  start: number;
  end: number;
  author: string;
  onSpect: boolean;
  collectionId: string;
}

export default function Governance() {
  const { mode } = useTheme();
  const router = useRouter();
  const { circle: cId, proposalStatus, proposalHash } = router.query;
  const [status, setStatus] = useState(proposalStatus);
  const { localCircle: circle, memberDetails } = useCircle();
  const [proposals, setProposals] = useState<any>([]);
  const [proposalId, setProposalId] = useState<string>(
    (proposalHash as string) || ""
  );
  const [collectionId, setCollectionId] = useState<string>("");
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const { refetch: fetchCollection, data: collections } = useQuery<
    CollectionType[]
  >(
    ["collections", circle?.id],
    () =>
      fetch(
        `${process.env.API_HOST}/collection/v1/${
          circle?.id as string
        }/getAllCollections`,
        {
          credentials: "include",
        }
      ).then((res) => {
        if (res.status === 403) return { unauthorized: true };
        return res.json();
      }),
    {
      enabled: false,
    }
  );

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

  function getAuthorDetails(auth: string) {
    const author =
      memberDetails &&
      Object.values(memberDetails?.memberDetails)?.find(
        (member) => member?.ethAddress?.toLowerCase() === auth?.toLowerCase()
      );
    return author;
  }

  useEffect(() => {
    fetchCollection();
    const activePeriods: Period[] = [];
    const completedPeriods: Period[] = [];

    collections &&
      Object.values(collections)?.map((collection) => {
        if (
          !collection.voting ||
          !collection.voting.enabled ||
          !collection.voting.periods
        )
          return;

        Object.entries(collection.voting.periods)?.map(([key, period]) => {
          if (period.snapshot?.proposalId) return;
          const proposal = {
            id: key,
            title: collection?.data?.[key]?.["Title"] || collection.name,
            start: Math.floor(
              new Date(period.startedOn as Date).getTime() / 1000
            ),
            end: Math.floor(new Date(period.endsOn as Date).getTime() / 1000),
            author: collection.creator,
            onSpect: true,
            collectionId: collection.id,
          };
          if (period.active === true) {
            activePeriods.push(proposal);
          } else if (period.active === false) {
            completedPeriods.push(proposal);
          }
        });
      });

    if (status === "Active") {
      const filteredData = [
        ...(activeProposals?.proposals || []),
        ...activePeriods,
      ].slice(0);
      filteredData.sort(function (a: any, b: any) {
        return new Date(b.start).getTime() - new Date(a.start).getTime();
      });
      setProposals(filteredData);
    } else if (status === "Completed") {
      const filteredData = [
        ...(closedProposals?.proposals || []),
        ...completedPeriods,
      ].slice(0);
      filteredData.sort(function (a: any, b: any) {
        return new Date(b.start).getTime() - new Date(a.start).getTime();
      });
      setProposals(filteredData);
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
          collection={collections && Object.values(collections)?.find(
            (c) => c.id === collectionId
          )}
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
                        setCollectionId(proposal.collectionId);
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
                          {!proposal.onSpect ? "Snapshot" : "Spect"}
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
          {proposals?.length === 0 && (
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
