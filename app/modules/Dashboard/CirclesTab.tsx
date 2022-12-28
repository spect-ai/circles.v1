import { CircleType, Option } from "@/app/types";
import { Box, Tag } from "degen";
import CircleCard from "@/app/modules/Explore/CircleCard/index";
import CreateCircleCard from "@/app/modules/Explore/CircleCard/CreateCircleCard";
import styled from "styled-components";
import { Col, Row } from "react-grid-system";
import { memo, useEffect, useState } from "react";
import Dropdown from "@/app/common/components/Dropdown";

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

  height: calc(100vh - 14rem);
`;

function YourCircles({
  circles,
  isLoading,
}: {
  circles: CircleType[];
  isLoading: boolean;
}) {
  const [circlesToShow, setCirclesToShow] = useState<CircleType[]>(circles);
  const [selectedFilter, setSelectedFilter] = useState<Option>({
    label: "Only show organizations",
    value: "onlyParents",
  });
  const options = [
    { label: "Show Organizations and Workstreams", value: "all" },
    { label: "Only show organizations", value: "onlyParents" },
  ];

  useEffect(() => {
    if (selectedFilter.value === "all") {
      setCirclesToShow(circles);
    } else {
      setCirclesToShow(
        circles.filter &&
          circles.filter(
            (circle) => !circle.parents || circle.parents?.length === 0
          )
      );
    }
  }, [selectedFilter, circles]);

  return (
    <ScrollContainer marginTop="4">
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
        marginBottom="4"
      >
        <Box
          marginRight={"4"}
          cursor="pointer"
          onClick={() => {
            if (selectedFilter.value === "all") {
              setSelectedFilter(options[1]);
            } else {
              setSelectedFilter(options[0]);
            }
          }}
        >
          <Tag tone="accent" size="medium">
            {selectedFilter.label}
          </Tag>
        </Box>
      </Box>
      <Row>
        {!isLoading &&
          circlesToShow?.map &&
          circlesToShow?.map((circle: CircleType) => (
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
