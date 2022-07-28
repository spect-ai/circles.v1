import { useGlobal } from "@/app/context/globalContext";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useCircle } from "../Circle/CircleContext";
import CreateRetro from "./CreateRetro";
import RetroModal from "./RetroModal";
import RetroRow from "./RetroRow";

export default function RetroPage() {
  const { circle, setPage, setRetro } = useCircle();
  const { isSidebarExpanded } = useGlobal();
  const [isRetroOpen, setIsRetroOpen] = useState(false);
  const { canDo } = useRoleGate();

  return (
    <Box
      style={{
        width: isSidebarExpanded ? "84%" : "100%",
      }}
      transitionDuration="500"
    >
      <AnimatePresence>
        {isRetroOpen && (
          <RetroModal handleClose={() => setIsRetroOpen(false)} />
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
          {canDo(["steward"]) && <CreateRetro />}
        </Stack>
        {circle?.retro?.map((retro) => (
          <Box
            key={retro.id}
            cursor="pointer"
            onClick={() => {
              setRetro(retro);
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
