import {
  Box,
  Avatar,
  Tag,
  IconCollection,
  Button,
  IconPlusSmall,
  IconLockClosedSolid,
  IconPencil,
  IconClose,
  IconSparkles,
  Text,
  Stack,
  useTheme,
} from "degen";
import { useDisconnect } from "wagmi";
import { useGlobal } from "@/app/context/globalContext";
import { UserType, BucketizedCircleType, CircleType } from "@/app/types";
import Link from "next/link";
import { useQuery } from "react-query";
import React, { memo, useState, useEffect } from "react";
import queryClient from "@/app/common/utils/queryClient";
import { ProjectOutlined } from "@ant-design/icons";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import CreateCircle from "@/app/modules/Sidebar/CreateCircleModal";

const ProfilePrompt = ({
  currentUser,
  setIsOpen,
}: {
  currentUser: UserType;
  setIsOpen: (open: boolean) => void;
}) => {
  const router = useRouter();

  const { mode } = useTheme();
  const Visibility =
    currentUser.avatar &&
    currentUser.circles.length !== 0 &&
    !currentUser.username.startsWith("fren");
  const [promptOpen, setPromptOpen] = useState(true);

  return (
    <>
      <Box
        style={{
          position: "absolute",
          right: "2rem",
          bottom: "1rem",
          zIndex: "2",
          marginBottom: "1rem",
          visibility: Visibility ? "hidden" : "visible",
          float: "right",
          display: "flex",
          flexDirection: "column",
          alignItems: "end",
        }}
      >
        <AnimatePresence>
          {promptOpen && (
            <Box
              backgroundColor={mode === "dark" ? "background" : "white"}
              padding="6"
              width="76"
              borderRadius={"2xLarge"}
              borderWidth="0.5"
              borderColor={"accent"}
              marginBottom="8"
            >
              <Stack direction="horizontal" align="center">
                <IconSparkles color="accent" />
                <Text variant="extraLarge" color="accent">
                  Welcome Fren !
                </Text>
              </Stack>
              <br />
              <Text variant="base">
                Let&apos;s complete the Spect Checklist!
              </Text>
              <br />
              <Stack direction="horizontal" align="center">
                <Button
                  shape="circle"
                  size="small"
                  variant="transparent"
                  onClick={() => setIsOpen(true)}
                >
                  <IconPencil
                    color={
                      currentUser.avatar === undefined ||
                      currentUser.username.startsWith("fren")
                        ? "accent"
                        : "textTertiary"
                    }
                    size="4"
                  />
                </Button>
                <Text
                  variant="base"
                  color={
                    currentUser.avatar === undefined  ||
                    currentUser.username.startsWith("fren")
                      ? "textPrimary"
                      : "textTertiary"
                  }
                >
                  Set up your Profile
                </Text>
              </Stack>
              <Stack direction="horizontal" align="center">
                <Button shape="circle" size="small" variant="transparent">
                  {currentUser.circles.length == 0 ? (
                    <CreateCircle size="small" />
                  ) : (
                    <IconPlusSmall size="5" color="textTertiary" />
                  )}
                </Button>
                <Text
                  variant="base"
                  color={
                    currentUser.circles.length == 0 ? "textPrimary" : "textTertiary"
                  }
                >
                  Create a Circle or be a part of one
                </Text>
              </Stack>

              <Stack direction="horizontal" align="flex-start">
                <Link href={"https://discord.gg/AF2qRMMpZ9"}>
                  <Button shape="circle" size="small" variant="transparent">
                    <IconLockClosedSolid color="accent" size="4" />
                  </Button>
                </Link>
                <Text variant="base" color={"textPrimary"}>
                  Join Spect&apos;s Discord Server to get Whitelisted and unlock
                  Premium Features
                </Text>
              </Stack>
            </Box>
          )}
        </AnimatePresence>
        <Button
          variant="secondary"
          onClick={() => setPromptOpen(!promptOpen)}
          shape="circle"
        >
          {promptOpen ? <IconClose /> : <IconSparkles />}
        </Button>
      </Box>
    </>
  );
};

export default ProfilePrompt;
