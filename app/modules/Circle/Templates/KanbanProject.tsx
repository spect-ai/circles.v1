import { Registry } from "@/app/types";
import { Box, Button, Heading, Stack } from "degen";
import React, { useState } from "react";
import { useCircle } from "../CircleContext";

import { createTemplateFlow } from "@/app/services/Templates";
import { useRouter } from "next/router";
import RewardTokenOptions from "../../Collection/AddField/RewardTokenOptions";

interface Props {
  handleClose: (close: boolean) => void;
  setLoading: (load: boolean) => void;
}

export default function KanbanProject({ handleClose, setLoading }: Props) {
  const { localCircle: circle, fetchCircle } = useCircle();
  const router = useRouter();
  const [networks, setNetworks] = useState<Registry>();

  const useTemplate = async () => {
    handleClose(false);
    setLoading(true);
    const res = await createTemplateFlow(
      circle?.id,
      {
        registry: networks,
      },
      3
    );
    console.log(res);
    if (res?.id) {
      setLoading(false);
      void router.push(
        `${res.slug}/r/${
          res.collections[
            res?.folderDetails[res?.folderOrder?.[0]]?.contentIds?.[0]
          ].slug
        }`
      );
      fetchCircle();
    }
  };

  return (
    <Box padding={"8"}>
      <Heading color={"accent"} align="left">
        Kanban Project
      </Heading>
      <Box paddingY={"6"}>
        <Stack direction={"vertical"} space="5">
          <RewardTokenOptions
            networks={networks}
            setNetworks={setNetworks}
            customText={
              "Add the token you'd want to use when paying contributors"
            }
            customTooltip={
              "Add the token you'd want to use when paying contributors"
            }
          />
          <Button
            onClick={() => useTemplate()}
            variant="secondary"
            size="small"
          >
            Create Project
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
