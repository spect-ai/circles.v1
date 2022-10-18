import { CircleType, BucketizedCircleType } from "@/app/types";
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
import { useQuery } from "react-query";
import { useEffect, useState, memo } from "react";
import { Container, Row, Col } from "react-grid-system";
import { useGlobal } from "@/app/context/globalContext";
import CircleCard from "@/app/modules/Explore/CircleCard/index";
import CreateCircleCard from "@/app/modules/Explore/CircleCard/CreateCircleCard";
import styled from "styled-components";

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding-top: 1rem;
  height: calc(100vh - 10rem);
  overflow-y: auto;
`;

function YourCircles({
  circles,
  isLoading,
}: {
  circles: CircleType[];
  isLoading: boolean;
}) {
  return (
    <ScrollContainer>
      <Row>
        {!isLoading &&
          circles?.map &&
          circles?.map((circle: CircleType) => (
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
      </Row>
    </ScrollContainer>
  );
}

export default memo(YourCircles);
