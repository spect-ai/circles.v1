import { CircleType } from "@/app/types";
import { Box } from "degen";
import CircleCard from "@/app/modules/Explore/CircleCard/index";
import CreateCircleCard from "@/app/modules/Explore/CircleCard/CreateCircleCard";
import styled from "styled-components";
import { Col, Row } from "react-grid-system";
import { memo } from "react";

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: auto;

  @media (max-width: 768px) {
    height: calc(100vh - 12rem);
  }

  height: calc(100vh - 10rem);
`;

function YourCircles({
  circles,
  isLoading,
}: {
  circles: CircleType[];
  isLoading: boolean;
}) {
  return (
    <ScrollContainer marginTop="4">
      <Row>
        {!isLoading &&
          circles?.map &&
          circles?.map((circle: CircleType) => (
            <Col key={circle.id} xs={12} sm={6} md={3}>
              <CircleCard
                href={`/${circle.slug}`}
                name={circle.name}
                description={circle.description}
                gradient={circle.gradient}
                logo={circle.avatar}
              />
            </Col>
          ))}
        <Col key={"createCircle"} xs={12} sm={6} md={3}>
          <CreateCircleCard />
        </Col>
      </Row>
    </ScrollContainer>
  );
}

export default memo(YourCircles);
