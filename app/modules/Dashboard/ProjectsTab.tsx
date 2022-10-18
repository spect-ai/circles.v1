import { CircleType, ProjectType } from "@/app/types";
import { Box, Stack, Text, useTheme } from "degen";
import React from "react";
import { Row, Col } from "react-grid-system";

import styled from "styled-components";
import Link from "next/link";
import { ProjectOutlined } from "@ant-design/icons";

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

const Card = styled(Box)<{ mode: string }>`
  border-width: 2px;
  cursor: pointer;
  border-color: border-color: ${(props) =>
    props.mode == "dark" ? "rgb(255, 255, 255, 0.1)" : "rgb(20,20,20,0.1)"};
  &:hover {
    border-color: rgb(191, 90, 242, 0.7);
  }
  transition-duration: 0.7s;
  color: rgb(191, 90, 242, 0.7);
  width: 100%;
  margin-right: 1rem;
`;

const ProjectCards = ({
  projects,
  circle,
}: {
  projects: ProjectType[];
  circle: CircleType;
}) => {
  const { mode } = useTheme();
  return (
    <>
      {projects?.map((project: ProjectType) => (
        <Col key={project.id} xs={10} sm={6} md={3}>
          <Link href={`/${circle.slug}/${project?.slug}`}>
            <Card padding="4" marginBottom="2" borderRadius="large" mode={mode}>
              <Stack direction={"horizontal"} align="center">
                <ProjectOutlined style={{ fontSize: "1.1rem" }} />
                <Text ellipsis variant="base" weight={"semiBold"}>
                  {project?.name}
                </Text>
              </Stack>
              <Box paddingTop={"2"}>
                <Text color={"textSecondary"}>{project?.description}</Text>
              </Box>
            </Card>
          </Link>
        </Col>
      ))}
    </>
  );
};

function YourProjects({
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
          circles?.map((circle: CircleType) => {
            return (
              <ProjectCards
                projects={circle?.projects as any}
                circle={circle}
                key={circle.id}
              />
            );
          })}
      </Row>
    </ScrollContainer>
  );
}

export default YourProjects;
