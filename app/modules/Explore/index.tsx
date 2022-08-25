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
  const { data: circles, isLoading } = useQuery<BucketizedCircleType>(
    "exploreCircles",
    {
      enabled: false,
    }
  );
  const { connectedUser } = useGlobal();
  useJoinCircle();
  const { onboarded } = useExploreOnboarding();

  const [filteredCircles, setFilteredCircles] = useState<CircleType[]>([]);
  const [joinableCircles, setJoinableCircles] = useState<CircleType[]>([]);
  const [claimableCircles, setClaimableCircles] = useState<CircleType[]>([]);

  const { mode } = useTheme();

  useEffect(() => {
    console.log(circles);
    if (circles) {
      setFilteredCircles(circles.memberOf);
      setJoinableCircles(circles.joinable);
      setClaimableCircles(circles.claimable);
    }
  }, [circles]);

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
        <Text size="headingTwo" weight="semiBold" ellipsis>
          Your Circles
        </Text>{" "}
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
          <Col key={`circle.id`} xs={10} sm={6} md={3}>
            <CreateCircleCard />
          </Col>
        </Row>
        <Text size="headingTwo" weight="semiBold" ellipsis>
          Explore Circles
        </Text>{" "}
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
          <Col key={`circle.id`} xs={10} sm={6} md={3}>
            <CreateCircleCard />
          </Col>
        </Row>
        <Text size="headingTwo" weight="semiBold" ellipsis>
          Claim Circles
        </Text>{" "}
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
          <Col key={`circle.id`} xs={10} sm={6} md={3}>
            <CreateCircleCard />
          </Col>
        </Row>
      </GridContainer>
    </ScrollContainer>
  );
}
