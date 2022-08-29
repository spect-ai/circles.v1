import { Avatar, Box, Tag, Text, useTheme } from "degen";
import Link from "next/link";
import { useState } from "react";
import PrimaryButton from "../PrimaryButton";
import { AnimatePresence, motion } from "framer-motion";
import { grow } from "@/app/common/components/Modal/index";

interface Props {
  username: string;
  userId: string;
  label: string;
  src: string;
  size: "1" | "1.5" | "2" | "2.5" | "4" | "6" | "8" | "10" | "12";
  address?: string;
  placeholder?: boolean;
}

export default function ClickableAvatar({
  username,
  userId,
  label,
  src,
  size,
  address,
  placeholder,
}: Props) {
  const [hover, setHover] = useState(false);
  const { mode } = useTheme();

  return (
    <>
      <Box
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: "relative",
        }}
      >
        <Avatar label={label} src={src} size={size} address={address} />
      </Box>
      <AnimatePresence>
        {hover && (
          <motion.div
            variants={grow}
            initial="hidden"
            animate="visible"
            exit="exit"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "0rem",
              zIndex: "2",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              maxWidth: "20rem",
              borderRadius: "0.5rem",
              boxShadow: `0rem 0.2rem 0.5rem ${
                mode === "dark" ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.1)"
              }`,
              backgroundColor: `${
                mode === "dark" ? "rgba(20, 20, 20, 1)" : "white"
              }`,
            }}
          >
            <Avatar label={userId} src={src} size="10" address={address} />
            <Text variant="large" weight="semiBold" whiteSpace="nowrap">
              {username}
            </Text>
            {address && (
              <Tag size="medium" hover>
                {address.substring(0, 5) + "..."}
              </Tag>
            )}
            <Link href={`/profile/${username}`}>
              <PrimaryButton>View Profile</PrimaryButton>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
