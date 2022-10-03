import Popover from "@/app/common/components/Popover";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import useJoinCircle from "@/app/services/JoinCircle/useJoinCircle";
import useExploreOnboarding from "@/app/services/Onboarding/useExploreOnboarding";
import { BucketizedCircleType, CircleType } from "@/app/types";
import {
  Box,
  IconDotsHorizontal,
  IconSearch,
  Input,
  Stack,
  Text,
  useTheme,
} from "degen";
import { matchSorter } from "match-sorter";
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-grid-system";
import { useQuery } from "react-query";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import CircleCard from "./CircleCard";
import CreateCircleCard from "./CircleCard/CreateCircleCard";
import Onboarding from "./ExploreOnboarding";
import ExploreOptions from "./ExploreOptions";
import { SkeletonLoader } from "./SkeletonLoader";

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

const PopoverScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  max-height: 14rem;
  overflow-y: auto;
`;

const PopoverOptionContainer = styled(Box)<{ mode: string }>`
  &:hover {
    // background-color: rgba(255, 255, 255, 0.1);
    background-color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 20, 20, 0.1)"};
  }
`;

type PopoverOptionProps = {
  onClick: (e?: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
  tourId?: string;
};

export const PopoverOption = ({
  children,
  onClick,
  tourId,
}: PopoverOptionProps) => {
  const { mode } = useTheme();

  return (
    <PopoverOptionContainer
      padding="4"
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
      borderRadius="2xLarge"
      data-tour={tourId}
      mode={mode}
    >
      <Text variant="small" weight="semiBold" ellipsis color="textSecondary">
        {children}
      </Text>
    </PopoverOptionContainer>
  );
};

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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { setIsSidebarExpanded } = useGlobal();
  const { mode } = useTheme();

  useEffect(() => {
    if (circles && connectedUser) {
      setJoinableCircles(circles.joinable);
      setClaimableCircles(circles.claimable);
      setIsSidebarExpanded(true);
    } else if (circles) {
      setJoinableCircles(circles.memberOf.concat(circles.joinable));
      setClaimableCircles(circles.claimable);
      setIsSidebarExpanded(true);
    }
    // TODODODO: Fix this bandage solution. Currently, the connected user state is updated multiple times
    //            causing 'Your Circles' to re-render multiple times when user connects wallet with the last render having an empty array
    // @avp pls halppppp
    if (circles && connectedUser && circles.memberOf?.length !== 0) {
      setFilteredCircles(circles.memberOf);
    }
  }, [circles, connectedUser, setIsSidebarExpanded]);

  if (isLoading) {
    return <SkeletonLoader />;
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
        <Box display="flex" flexDirection="row">
          <Box width="1/2" paddingTop="1" paddingRight="8" paddingBottom="4">
            <Input
              label=""
              placeholder="Find"
              prefix={<IconSearch />}
              suffix={<ExploreOptions />}
              onChange={(e) => {
                setFilteredCircles(
                  matchSorter(
                    circles?.memberOf as CircleType[],
                    e.target.value,
                    {
                      keys: ["name"],
                    }
                  )
                );
                setJoinableCircles(
                  matchSorter(
                    circles?.joinable as CircleType[],
                    e.target.value,
                    {
                      keys: ["name"],
                    }
                  )
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
          <Box
            display="flex"
            flexDirection="row"
            width="1/2"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Box marginRight="4">
                <PrimaryButton
                  onClick={() => {
                    window.open(
                      "https://calendly.com/adityachakra16/outreach",
                      "_blank"
                    );
                  }}
                >
                  Book a Demo
                </PrimaryButton>
              </Box>
              <Box marginRight="6">
                <Popover
                  butttonComponent={
                    <Box
                      cursor="pointer"
                      onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                      color="foreground"
                    >
                      <IconDotsHorizontal color="textSecondary" />
                    </Box>
                  }
                  isOpen={isPopoverOpen}
                  setIsOpen={setIsPopoverOpen}
                >
                  <PopoverScrollContainer
                    backgroundColor="background"
                    borderWidth="0.5"
                    borderRadius="2xLarge"
                  >
                    <PopoverOption
                      onClick={() => {
                        window.open("https://mirror.xyz/chaks.eth", "_blank");
                      }}
                    >
                      <Stack direction="horizontal" space="1">
                        <Text>Product Updates</Text>
                      </Stack>
                    </PopoverOption>
                    <PopoverOption
                      onClick={() => {
                        window.open(
                          "https://mirror.xyz/chaks.eth/us5rOm1jSsvmvqBOmef_SZSP6zzbNeo7ay-_DkacC64",
                          "_blank"
                        );
                      }}
                    >
                      <Stack direction="horizontal" space="1">
                        <Text>Manifesto</Text>
                      </Stack>
                    </PopoverOption>
                    <PopoverOption
                      onClick={() => {
                        window.open("https://discord.gg/6WhHZ7sm", "_blank");
                      }}
                    >
                      <Stack direction="horizontal" space="1">
                        <Text>Come say GM!</Text>
                      </Stack>
                    </PopoverOption>

                    <PopoverOption
                      onClick={() => {
                        window.open("https://twitter.com/JoinSpect", "_blank");
                      }}
                    >
                      <Stack direction="horizontal" space="1">
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                        >
                          <Text>Follow on Twitter</Text>
                        </Box>
                      </Stack>
                    </PopoverOption>
                  </PopoverScrollContainer>
                </Popover>
              </Box>
            </Box>
          </Box>
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
                <Col key={"createCircle"} xs={10} sm={6} md={3}>
                  <CreateCircleCard />
                </Col>
              </Row>{" "}
            </Box>
          </>
        )}
        {joinableCircles && joinableCircles.length > 0 && (
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
            </Box>
            <Row>
              {joinableCircles?.map &&
                joinableCircles?.map((circle: CircleType) => {
                  return (
                    <Col key={circle.id} xs={10} sm={6} md={3}>
                      <CircleCard
                        href={`/${circle.slug}`}
                        name={circle.name}
                        description={circle.description}
                        gradient={circle.gradient}
                        logo={circle.avatar}
                      />
                    </Col>
                  );
                })}
              {connectedUser && (
                <Col key={"createCircle"} xs={10} sm={6} md={3}>
                  <CreateCircleCard />
                </Col>
              )}
            </Row>
          </Box>
        )}
      </GridContainer>
    </ScrollContainer>
  );
}
