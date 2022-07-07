import { FC, ReactNode, useEffect, useRef } from "react";

import { Box } from "degen";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  butttonComponent: ReactNode;
  children: ReactNode;
  tourId?: string;
  width?: string;
}

// grow animation for popover
const grow = {
  hidden: {
    opacity: 0,
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  collapsed: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.1,
    },
  },
};

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref: any, setIsOpen: (isOpen: boolean) => void) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        // alert("You clicked outside of me!");
        setIsOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setIsOpen]);
}

const Popover: FC<Props> = ({
  butttonComponent,
  children,
  isOpen,
  setIsOpen,
  tourId,
  width = "full",
}) => {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setIsOpen);

  return (
    <Box ref={wrapperRef} width={width as any} data-tour={tourId}>
      {/* <Box
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        color="foreground"
      >
        {icon}
      </Box> */}
      {butttonComponent}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="open"
            exit="collapsed"
            variants={grow}
          >
            <Box position="absolute" zIndex="10">
              {children}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Popover;

export type { Props as PopoverProps };
