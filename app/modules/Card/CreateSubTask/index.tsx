import { Button, IconPlusSmall } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import CreateCardModal from "../../Project/CreateCardModal";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";

export default function CreateSubTask() {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const { columnId } = useLocalCard();
  return (
    <>
      <Button
        data-tour="circle-sidebar-create-project-button"
        size="small"
        variant="tertiary"
        shape="circle"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <IconPlusSmall />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <CreateCardModal
            column={columnId}
            handleClose={() => {
              if (isDirty && !showConfirm) {
                setShowConfirm(true);
              } else {
                setIsOpen(false);
              }
            }}
            setIsDirty={setIsDirty}
            showConfirm={showConfirm}
            setShowConfirm={setShowConfirm}
            setIsOpen={setIsOpen}
          />
        )}
      </AnimatePresence>
    </>
  );
}
