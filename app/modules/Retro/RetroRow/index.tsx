import { RetroType } from "@/app/types";
import { Box, Stack, Text } from "degen";
import React from "react";

type Props = {
  retro: RetroType;
};

export default function RetroRow({ retro }: Props) {
  return (
    <Box
      width="full"
      borderWidth="0.375"
      borderRadius="2xLarge"
      paddingY="4"
      paddingX="8"
      cursor="pointer"
    >
      <Stack direction="horizontal">
        <Text>{retro.title}</Text>
      </Stack>
    </Box>
  );
}
