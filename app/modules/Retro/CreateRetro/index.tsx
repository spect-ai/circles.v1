import {
  Box,
  Button,
  IconPlusSmall,
  IconLightningBolt,
  useTheme,
  Text,
} from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import CreateRetroModal from "./CreateRetroModal";
import { Tooltip } from "react-tippy";

export default function CreateRetro({ folderId }: { folderId?: string }) {
  const { mode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {folderId ? (
        <Tooltip html={<Text>Create Retro</Text>} theme={mode}>
          <Button
            size="small"
            variant="transparent"
            shape="circle"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          >
            <IconLightningBolt size={"4"} color="accent" />
          </Button>
        </Tooltip>
      ) : (
        <Box marginTop="1">
          <Button
            data-tour="circle-create-workstream-button"
            size="small"
            variant="transparent"
            shape="circle"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          >
            <IconPlusSmall />
          </Button>
        </Box>
      )}

      <AnimatePresence>
        {isOpen && (
          <CreateRetroModal
            handleClose={() => setIsOpen(false)}
            folderId={folderId}
          />
        )}
      </AnimatePresence>
    </>
  );
}
