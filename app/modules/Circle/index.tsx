import Card from "@/app/common/components/Card";
import { Box, Heading, Stack, Text } from "degen";
import React from "react";
import { useQuery } from "react-query";

export default function Circle() {
  const { data: circle } = useQuery<Circle>("circle");
  return (
    <Box padding="8">
      <Heading>{circle?.name}</Heading>
      <Card href="/" height="32">
        <Box width="32">
          <Stack align="center">
            <Text>Test Project 1</Text>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}
