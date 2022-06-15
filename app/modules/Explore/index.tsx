import Card from "@/app/common/components/Card";
import { CircleType } from "@/app/types";
import { Avatar, Box, Button, Stack, Text } from "degen";
import { useRouter } from "next/router";
import React from "react";
import { Container, Row, Col } from "react-grid-system";
import { useQuery } from "react-query";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";

const ScrollContainer = styled.div`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 6rem);
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
  const { data: circles } = useQuery<CircleType[]>("exploreCircles");
  const router = useRouter();
  return (
    <ScrollContainer>
      <Box padding="8">
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
      </Box>
    </ScrollContainer>
  );
}
