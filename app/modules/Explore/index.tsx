import Loader from "@/app/common/components/Loader";
import { useGlobal } from "@/app/context/globalContext";
import useConnectDiscord from "@/app/services/Discord/useConnectDiscord";
import useJoinCircle from "@/app/services/JoinCircle/useJoinCircle";
import useExploreOnboarding from "@/app/services/Onboarding/useExploreOnboarding";
import { BucketizedCircleType, CircleType } from "@/app/types";
import {
  Avatar,
  Box,
  Button,
  IconSearch,
  Input,
  Stack,
  Text,
  useTheme,
} from "degen";
import { matchSorter } from "match-sorter";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-grid-system";
import { useQuery } from "react-query";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import CircleCard from "./CircleCard";
import CreateCircleCard from "./CircleCard/CreateCircleCard";
import Onboarding from "./ExploreOnboarding";
import ExploreOptions from "./ExploreOptions";

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 1rem);
  overflow-y: auto;
`;

const GridContainer = styled(Container)`
  @media only screen and (min-width: 0px) {
    width: calc(100vw - 2rem);
  }
  @media only screen and (min-width: 768px) {
    width: 80rem;
  }
`;

export default function Explore() {
  const {
    data: circles,
    isLoading,
    refetch,
  } = useQuery<BucketizedCircleType>("exploreCircles", {
    enabled: false,
  });
  const { connectedUser } = useGlobal();
  useJoinCircle();
  const { onboarded } = useExploreOnboarding();

  const [filteredCircles, setFilteredCircles] = useState<CircleType[]>([]);
  const [joinableCircles, setJoinableCircles] = useState<CircleType[]>([]);
  const [claimableCircles, setClaimableCircles] = useState<CircleType[]>([]);
  const { setIsSidebarExpanded } = useGlobal();
  const { mode } = useTheme();

  useEffect(() => {
    if (circles && connectedUser) {
      console.log(connectedUser);
      setJoinableCircles(circles.joinable);
      setClaimableCircles(circles.claimable);
      setIsSidebarExpanded(true);
    } else if (circles) {
      setJoinableCircles(circles.joinable);
      setClaimableCircles(circles.claimable);
      setIsSidebarExpanded(true);
    }
    // TODODODO: Fix this bandage solution. Currently, the connected user state is updated multiple times
    //            causing 'Your Circles' to re-render multiple times when user connects wallet with the last render having an empty array
    // @avp pls halppppp
    if (circles && connectedUser && circles.memberOf?.length !== 0) {
      setFilteredCircles(circles.memberOf);
    }
  }, [circles, connectedUser]);

  if (isLoading) {
    return <Loader text="" loading />;
  }

  return (
    <ScrollContainer padding="2" theme="dark">
      {!onboarded && connectedUser && <Onboarding />}
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
      <GridContainer>
        <Box width="1/2" paddingTop="1" paddingRight="8" paddingBottom="4">
          <Input
            label=""
            placeholder="Find"
            prefix={<IconSearch />}
            suffix={<ExploreOptions />}
            onChange={(e) => {
              setFilteredCircles(
                matchSorter(circles?.memberOf as CircleType[], e.target.value, {
                  keys: ["name"],
                })
              );
              setJoinableCircles(
                matchSorter(circles?.joinable as CircleType[], e.target.value, {
                  keys: ["name"],
                })
              );
              setClaimableCircles(
                matchSorter(
                  circles?.claimable as CircleType[],
                  e.target.value,
                  {
                    keys: ["name"],
                  }
                )
              );
            }}
          />
        </Box>
        {connectedUser && filteredCircles && filteredCircles.length > 0 && (
          <>
            {" "}
            <Box
              marginBottom={{ xs: "2", md: "4" }}
              marginTop={{ xs: "2", md: "4" }}
            >
              <Box
                marginBottom={{ xs: "1", md: "2" }}
                marginLeft={{ xs: "1", md: "2" }}
                display="flex"
                flexDirection="row"
                alignItems="center"
              >
                <Box marginRight={{ xs: "2", md: "4" }}>
                  <Text size="headingTwo" weight="semiBold" ellipsis>
                    Your Circles
                  </Text>
                </Box>
                <CreateCircleCard />
              </Box>
              <Row>
                {filteredCircles?.map &&
                  filteredCircles?.map((circle: CircleType) => (
                    <Col key={circle.id} xs={10} sm={6} md={3}>
                      <CircleCard
                        href={`/${circle.slug}`}
                        name={circle.name}
                        description={circle.description}
                        gradient={circle.gradient}
                        logo={circle.avatar}
                      />
                    </Col>
                  ))}
              </Row>{" "}
            </Box>
          </>
        )}
        <Box
          marginBottom={{ xs: "2", md: "4" }}
          marginTop={{ xs: "2", md: "4" }}
        >
          <Box
            marginBottom={{ xs: "1", md: "2" }}
            marginLeft={{ xs: "1", md: "2" }}
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
            <Box marginRight={{ xs: "2", md: "4" }}>
              <Text size="headingTwo" weight="semiBold" ellipsis>
                Explore Circles
              </Text>
            </Box>
            <CreateCircleCard />
          </Box>
          <Row>
            {joinableCircles?.map &&
              joinableCircles?.map((circle: CircleType) => (
                <Col key={circle.id} xs={10} sm={6} md={3}>
                  <CircleCard
                    href={`/${circle.slug}`}
                    name={circle.name}
                    description={circle.description}
                    gradient={circle.gradient}
                    logo={circle.avatar}
                  />
                </Col>
              ))}
          </Row>
        </Box>
        <Box
          marginBottom={{ xs: "2", md: "4" }}
          marginTop={{ xs: "2", md: "4" }}
        >
          <Box
            marginBottom={{ xs: "1", md: "2" }}
            marginLeft={{ xs: "1", md: "2" }}
            display="flex"
            flexDirection="row"
            alignItems="center"
          >
            <Box marginRight={{ xs: "2", md: "4" }}>
              <Text size="headingTwo" weight="semiBold" ellipsis>
                Claim Circles
              </Text>
            </Box>
            <CreateCircleCard />
          </Box>
          <Row>
            {claimableCircles?.map &&
              claimableCircles?.map((circle: CircleType) => (
                <Col key={circle.id} xs={10} sm={6} md={3}>
                  <CircleCard
                    href={`/${circle.slug}`}
                    name={circle.name}
                    description={circle.description}
                    gradient={circle.gradient}
                    logo={circle.avatar}
                  />
                </Col>
              ))}
          </Row>
        </Box>
      </GridContainer>
    </ScrollContainer>
  );
}
