import { Box, Stack } from "degen";
import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import { fadeVariant } from "../Card/Utils/variants";

export const SkeletonLoader = () => {
  return (
    <motion.main
      variants={fadeVariant} // Pass the variant object into Framer Motion
      initial="hidden" // Set the initial state to variants.hidden
      animate="enter" // Animated state to variants.enter
      exit="exit" // Exit state (used later) to variants.exit
      transition={{ type: "linear" }} // Set the transition to linear
      className=""
    >
      <SkeletonTheme
        baseColor="rgb(20,20,20,1)"
        highlightColor="rgb(255,255,255,0.1)"
      >
        <Box padding="6" marginTop="-2.5">
          <Stack direction="horizontal">
            <Skeleton
              enableAnimation
              style={{
                height: "calc(100vh - 10rem)",
                width: "22rem",
                borderRadius: "1rem",
              }}
            />
            <Skeleton
              enableAnimation
              style={{
                height: "calc(100vh - 10rem)",
                width: "22rem",
                borderRadius: "1rem",
              }}
            />
            <Skeleton
              enableAnimation
              style={{
                height: "calc(100vh - 10rem)",
                width: "22rem",
                borderRadius: "1rem",
              }}
            />
            <Skeleton
              enableAnimation
              style={{
                height: "calc(100vh - 10rem)",
                width: "22rem",
                borderRadius: "1rem",
              }}
            />
          </Stack>
        </Box>
      </SkeletonTheme>
    </motion.main>
  );
};
