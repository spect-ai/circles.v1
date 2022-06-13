import Card from "@/app/common/components/Card";
import { Box } from "degen";
import React from "react";
import { Container, Row, Col } from "react-grid-system";
import { useQuery } from "react-query";

export default function Explore() {
  const { data: circles } = useQuery<Circle[]>("circle");
  return (
    <Box padding="8">
      <Container style={{ width: "60rem" }}>
        <Row>
          {circles?.map((circle: Circle) => (
            <Col key={circle.id} sm={3}>
              <Card
                href={`/${circle.slug}`}
                title={circle.name}
                avatar={circle.avatar}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </Box>
  );
}
