import { Box, Stack, useTheme } from "degen";
import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Skelitem = () => (
  <Skeleton
    enableAnimation
    style={{
      height: "5rem",
      width: "20.5rem",
      borderRadius: "0.5rem",
    }}
  />
);

export const SkeletonLoader = () => {
  const { mode } = useTheme();

  return (
    <SkeletonTheme
      baseColor={mode === "dark" ? "rgb(20,20,20)" : "rgb(255,255,255)"}
      highlightColor={
        mode === "dark" ? "rgb(255,255,255,0.1)" : "rgb(20,20,20,0.1)"
      }
    >
      <Box padding="8" marginTop="6" marginLeft="-2">
        <Stack direction="horizontal" space="8">
          <Stack space="2">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skelitem key={i} />
              ))}
          </Stack>
          <Stack space="2">
            {Array(7)
              .fill(0)
              .map((_, i) => (
                <Skelitem key={i} />
              ))}
          </Stack>
          <Stack space="2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skelitem key={i} />
              ))}
          </Stack>
          <Stack space="2">
            {Array(2)
              .fill(0)
              .map((_, i) => (
                <Skelitem key={i} />
              ))}
          </Stack>
        </Stack>
      </Box>
    </SkeletonTheme>
  );
};
