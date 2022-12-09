import { CollectionType } from "@/app/types";
import { Avatar, Box, IconCollection, Stack, Text, useTheme } from "degen";
import Link from "next/link";
import React, { useEffect } from "react";
import { Col, Row } from "react-grid-system";
import { useQuery } from "react-query";
import styled from "styled-components";

function ResponsesTab() {
  const { data: responses, refetch } = useQuery<Partial<CollectionType>[]>(
    "dashboardResponses",
    () =>
      fetch(`${process.env.API_HOST}/user/v1/responses`, {
        credentials: "include",
      }).then((res) => res.json()),
    {
      enabled: false,
    }
  );
  const { mode } = useTheme();

  useEffect(() => {
    void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (responses && responses.length > 0) {
    return (
      <Box marginTop="4">
        <Row gutterWidth={10}>
          {responses?.map((collection: Partial<CollectionType>) => (
            <Col key={collection.id} xs={10} sm={6} md={3}>
              <Link href={`r/${collection?.slug}`}>
                <Card
                  padding="4"
                  marginBottom="2"
                  borderRadius="large"
                  mode={mode}
                >
                  <Stack direction="horizontal" align="center">
                    {collection?.logo ? (
                      <Avatar src={collection?.logo} label="" size="6" />
                    ) : (
                      <IconCollection />
                    )}
                    <Text ellipsis variant="base" weight="semiBold">
                      {collection?.name}
                    </Text>
                  </Stack>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Box>
    );
  } else {
    return (
      <Box style={{ margin: "35vh 15vw" }}>
        <Text color="accent" align="center">
          No form responses submitted yet
        </Text>
      </Box>
    );
  }

  return <div>ResponsesTab</div>;
}

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

export default ResponsesTab;
