import { useGlobal } from "@/app/context/globalContext";
import { Box, Stack, Text } from "degen";
import React from "react";
import { useCircle } from "../Circle/CircleContext";
import RetroRow from "./RetroRow";

export default function RetroPage() {
  const { circle, setPage } = useCircle();
  const { isSidebarExpanded } = useGlobal();
  return (
    <Box
      style={{
        width: isSidebarExpanded ? "84%" : "100%",
      }}
      transitionDuration="500"
    >
      <Box cursor="pointer" onClick={() => setPage("Overview")}>
        <Text size="small">Back to Overview</Text>
      </Box>
      <Stack>
        <Text size="headingTwo" weight="semiBold" ellipsis>
          Retro
        </Text>
        {circle?.retro.map((retro) => (
          <RetroRow retro={retro} key={retro.id} />
        ))}
      </Stack>
    </Box>
  );
}
