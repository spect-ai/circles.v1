/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { Box } from "degen";
import { usePopper } from "react-popper";
import { AnimatePresence } from "framer-motion";
import Portal from "../Portal/portal";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  butttonComponent: ReactNode;
  children: ReactNode;
  tourId?: string;
  width?: string;
  disableOutsideClick?: boolean;
  dependentRef?: any;
}

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOutsideAlerter(
  ref: any,
  setIsOpen: (isOpen: boolean) => void,
  disabled?: boolean,
  dependentRef?: any
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (
        !disabled &&
        ref.current &&
        !(
          ref.current.contains(event.target) ||
          dependentRef?.current?.contains(event.target)
        )
      ) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, setIsOpen]);
}

const Popover: FC<Props> = ({
  butttonComponent,
  children,
  isOpen,
  setIsOpen,
  tourId,
  width = "full",
  disableOutsideClick = false,
  dependentRef,
}) => {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setIsOpen, disableOutsideClick, dependentRef);

  const [anchorElement, setAnchorElement] = useState<any>();
  const [popperElement, setPopperElement] = useState<any>();

  const { styles, attributes } = usePopper(anchorElement, popperElement, {
    placement: "bottom-start",
  });

  return (
    <Box width={width as any} data-tour={tourId}>
      <div ref={setAnchorElement}>{butttonComponent}</div>
      <AnimatePresence>
        {isOpen && (
          <Portal>
            <Box
              position="absolute"
              zIndex="10"
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
            >
              <div ref={wrapperRef}>{children}</div>
            </Box>
          </Portal>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Popover;

export type { Props as PopoverProps };
