import { Registry } from "@/app/types";
import { Box, Button, Heading, Stack } from "degen";
import React, { useState } from "react";
import { useCircle } from "../CircleContext";

import { createTemplateFlow } from "@/app/services/Templates";
import { useRouter } from "next/router";
import RewardTokenOptions from "../../Collection/AddField/RewardTokenOptions";
import { useAtom } from "jotai";
import { scribeOpenAtom, scribeUrlAtom } from "@/pages/_app";
import { Scribes } from "@/app/common/utils/constants";

interface Props {
  handleClose: (close: boolean) => void;
}

export default function KanbanProject({ handleClose }: Props) {
  const { localCircle: circle, registry, setCircleData } = useCircle();
  const router = useRouter();
  const [networks, setNetworks] = useState<Registry | undefined>({
    "137": registry?.["137"],
  } as Registry);
  const [, setIsScribeOpen] = useAtom(scribeOpenAtom);
  const [, setScribeUrl] = useAtom(scribeUrlAtom);

  const useTemplate = async () => {
    handleClose(false);
    const res = await createTemplateFlow(
      circle?.id,
      {
        registry: networks,
      },
      3
    );
    console.log(res);
    if (res?.id) {
      setScribeUrl(Scribes.kanban.using);
      setIsScribeOpen(true);
      setCircleData(res);
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
              "Include the tokens you intend to utilise for distributing funds to contributors."
            }
            customTooltip={
              "Add the tokens you'd want to use when paying contributors"
            }
            newTokenOpen={true}
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
