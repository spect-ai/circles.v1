import { Box, Button, IconPlusSmall } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import CreateRetroModal from "./CreateRetroModal";

export default function CreateRetro() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
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
      <AnimatePresence>
        {isOpen && <CreateRetroModal handleClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
