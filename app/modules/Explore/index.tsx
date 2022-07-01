import Card from "@/app/common/components/Card";
import Loader from "@/app/common/components/Loader";
import { useGlobalContext } from "@/app/context/globalContext";
import useJoinCircle from "@/app/services/JoinCircle/useJoinCircle";
import useExploreOnboarding from "@/app/services/Onboarding/useExploreOnboarding";
import useConnectDiscord from "@/app/services/Profile/useConnectDiscord";
import { CircleType } from "@/app/types";
import { Avatar, Box, Button, Stack, Text } from "degen";
import { useRouter } from "next/router";
import { Container, Row, Col } from "react-grid-system";
import { useQuery } from "react-query";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import Onboarding from "./ExploreOnboarding";

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
    width: 60rem;
  }
`;

export default function Explore() {
  const { data: circles, isLoading } = useQuery<CircleType[]>(
    "exploreCircles",
    {
      enabled: false,
    }
  );
  const { connectedUser } = useGlobalContext();
  const router = useRouter();
  useJoinCircle();
  useConnectDiscord();
  const { onboarded } = useExploreOnboarding();

  if (isLoading) {
    return <Loader text="" loading />;
  }

  return (
    <ScrollContainer padding="8">
      {!onboarded && connectedUser && <Onboarding />}
      <ToastContainer />
      <GridContainer>
        <Row>
          {circles?.map((circle: CircleType) => (
            <Col key={circle.id} xs={10} sm={6} md={3}>
              <Card
                height={{ xs: "48", md: "60" }}
                onClick={() => {
                  void router.push(`/${circle.slug}`);
                }}
              >
                <Box marginBottom="4">
                  <Stack align="center">
                    <Avatar
                      label={circle.name}
                      src={circle.avatar}
                      size={{ xs: "16", lg: "20" }}
                      placeholder={!circle.avatar}
                    />
                    <Text
                      color="textPrimary"
                      size={{ sm: "base", md: "base", lg: "large" }}
                      letterSpacing="0.03"
                      ellipsis
                    >
                      {circle.name}
                    </Text>
                    <Button variant="tertiary" size="small">
                      Follow
                    </Button>
                  </Stack>
                </Box>
              </Card>
            </Col>
          ))}
        </Row>
      </GridContainer>
    </ScrollContainer>
  );
}
