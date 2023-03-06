import { Box, Stack, useTheme } from "degen";
import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Skelitem = () => (
  <Skeleton
    enableAnimation
    style={{
      height: "2rem",
      width: "14rem",
      borderRadius: "0.5rem",
      marginRight: "1rem",
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
      <Box width="1/2" paddingTop="1" paddingRight="8" paddingBottom="4">
        <Skeleton
          enableAnimation
          style={{
            margin: "1rem",
            marginLeft: "3rem",
            height: "2rem",
            width: "28rem",
            borderRadius: "0.5rem",
          }}
        />
        <Skeleton
          enableAnimation
          style={{
            marginLeft: "3rem",
            height: "1rem",
            width: "14rem",
            borderRadius: "0.5rem",
          }}
        />
      </Box>

      <Box width="1/2" paddingTop="1" paddingRight="8" paddingBottom="4">
        <Skeleton
          enableAnimation
          style={{
            margin: "1rem",
            marginLeft: "3rem",
            height: "1rem",
            width: "14rem",
            borderRadius: "0.5rem",
          }}
        />
        <Skeleton
          enableAnimation
          style={{
            marginLeft: "3rem",
            height: "2rem",
            width: "28rem",
            borderRadius: "0.5rem",
          }}
        />
      </Box>
      <Box width="1/2" paddingTop="1" paddingRight="8" paddingBottom="4">
        <Skeleton
          enableAnimation
          style={{
            margin: "1rem",
            marginLeft: "3rem",
            height: "1rem",
            width: "14rem",
            borderRadius: "0.5rem",
          }}
        />
        <Skeleton
          enableAnimation
          style={{
            marginLeft: "3rem",
            height: "2rem",
            width: "28rem",
            borderRadius: "0.5rem",
          }}
        />
      </Box>
      <Box width="1/2" paddingTop="1" paddingRight="8" paddingBottom="4">
        <Skeleton
          enableAnimation
          style={{
            margin: "1rem",
            marginLeft: "3rem",
            height: "1rem",
            width: "14rem",
            borderRadius: "0.5rem",
          }}
        />
        <Skeleton
          enableAnimation
          style={{
            marginLeft: "3rem",
            height: "2rem",
            width: "28rem",
            borderRadius: "0.5rem",
          }}
        />
      </Box>
      <Box width="1/2" paddingTop="1" paddingRight="8" paddingBottom="4">
        <Skeleton
          enableAnimation
          style={{
            margin: "1rem",
            marginLeft: "3rem",
            height: "1rem",
            width: "14rem",
            borderRadius: "0.5rem",
          }}
        />
        <Skeleton
          enableAnimation
          style={{
            marginLeft: "3rem",
            height: "2rem",
            width: "28rem",
            borderRadius: "0.5rem",
          }}
        />
      </Box>
      <Box width="1/2" paddingTop="1" paddingRight="8" paddingBottom="4">
        <Skeleton
          enableAnimation
          style={{
            margin: "1rem",
            marginLeft: "3rem",
            height: "1rem",
            width: "14rem",
            borderRadius: "0.5rem",
          }}
        />
        <Skeleton
          enableAnimation
          style={{
            marginLeft: "3rem",
            height: "2rem",
            width: "28rem",
            borderRadius: "0.5rem",
          }}
        />
      </Box>
    </SkeletonTheme>
  );
};
