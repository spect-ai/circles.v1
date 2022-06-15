import Card from "@/app/common/components/Card";
import { Avatar, Box, Button, Stack, Text } from "degen";
import React from "react";
import { Container, Row, Col } from "react-grid-system";
import { useQuery } from "react-query";
import { ToastContainer } from "react-toastify";

export default function Explore() {
  const { data: circles } = useQuery<Circle[]>("exploreCircles");
  return (
    <Box padding="8">
      <ToastContainer />
      <Container style={{ width: "60rem" }}>
        <Row>
          {circles?.map((circle: Circle) => (
            <Col key={circle.id} sm={3}>
              <Card href={`/${circle.slug}`} height="60">
                <Box marginBottom="4">
                  <Stack align="center">
                    <Avatar
                      label={circle.name}
                      src={circle.avatar}
                      size="20"
                      placeholder={!circle.avatar}
                    />
                    <Text
                      color="textPrimary"
                      size="large"
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
      </Container>
    </Box>
  );
}
