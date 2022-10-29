import { useGlobal } from "@/app/context/globalContext";
import { Box, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useCircle } from "../Circle/CircleContext";
import RetroModal from "./RetroModal";
import RetroRow from "./RetroRow";

export default function RetroPage() {
  const { circle, setPage } = useCircle();
  const { isSidebarExpanded } = useGlobal();
  const [isRetroOpen, setIsRetroOpen] = useState(false);

  const router = useRouter();

  return (
    <Box
      style={{
        width: isSidebarExpanded ? "84%" : "100%",
      }}
      transitionDuration="500"
    >
      <AnimatePresence>
        {isRetroOpen && (
          <RetroModal
            handleClose={() => {
              setIsRetroOpen(false);
              void router.push(`/${circle?.slug}`);
            }}
          />
        )}
      </AnimatePresence>
      <Box cursor="pointer" onClick={() => setPage("Overview")}>
        <Text size="small">Back to Overview</Text>
      </Box>
      <Stack>
        <Stack direction="horizontal">
          <Text size="headingTwo" weight="semiBold" ellipsis>
            Retro
          </Text>
        </Stack>
        {circle?.retro &&
          Object.values(circle?.retro)?.map((retro) => (
            <Box
              key={retro.id}
              cursor="pointer"
              onClick={() => {
                void router.push(`${circle.slug}?retroSlug=${retro.slug}`);
                setIsRetroOpen(true);
              }}
            >
              <RetroRow retro={retro} key={retro.id} />
            </Box>
          ))}
      </Stack>
    </Box>
  );
}
