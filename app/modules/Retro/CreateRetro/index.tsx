import { Button, IconPlusSmall } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import CreateRetroModal from "./CreateRetroModal";

export default function CreateRetro() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
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
      <AnimatePresence>
        {isOpen && <CreateRetroModal handleClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
