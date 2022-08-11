import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { Box } from "degen";
import { Portal } from "../Portal/portal";
import { usePopper } from "react-popper";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  butttonComponent: ReactNode;
  children: ReactNode;
  tourId?: string;
  width?: string;
  disableOutsideClick?: boolean;
}

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOutsideAlerter(
  ref: any,
  setIsOpen: (isOpen: boolean) => void,
  disabled?: boolean
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (!disabled && ref.current && !ref.current.contains(event.target)) {
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
  disableOutsideClick = false,
}) => {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setIsOpen, disableOutsideClick);

  const [anchorElement, setAnchorElement] = useState<any>();
  const [popperElement, setPopperElement] = useState<any>();

  const { styles, attributes } = usePopper(anchorElement, popperElement, {
    placement: "bottom-start",
  });

  return (
    <Box width={width as any} data-tour={tourId}>
      {/* <Box
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        color="foreground"
      >
        {icon}
      </Box> */}
      <div ref={setAnchorElement}>{butttonComponent}</div>
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
    </Box>
  );
};

export default Popover;

export type { Props as PopoverProps };
