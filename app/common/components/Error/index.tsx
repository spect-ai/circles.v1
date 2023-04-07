import React from "react";
import { Box, Heading, useTheme } from "degen";
import styled from "styled-components";
import { VioletBlur } from "@/app/modules/Dashboard/ConnectPage";
import { FrownOutlined } from "@ant-design/icons";
import PrimaryButton from "../PrimaryButton";

const DesktopContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ErrorFallBack = () => {
  const { mode } = useTheme();
  const href =
    process.env.NODE_ENV === "production"
      ? "https://circles.spect.network"
      : "http://localhost:3000/";
  return (
    <DesktopContainer
      backgroundColor={mode === "dark" ? "background" : "backgroundSecondary"}
      id="Error screen"
      position="relative"
    >
      <VioletBlur style={{ top: "0px", left: "0rem" }} />
      <Box
        style={{
          margin: "30vh auto",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <FrownOutlined
          style={{ fontSize: "3rem", color: "rgb(191, 90, 242)" }}
        />
        <Heading>Ouch! Something went wrong.</Heading>
        <PrimaryButton
          onClick={() => {
            window.location.replace(href);
          }}
        >
          Try again
        </PrimaryButton>
      </Box>
    </DesktopContainer>
  );
};

export default ErrorFallBack;
