import {
  Box,
  Button,
  IconChevronRight,
  Input,
  Stack,
  Text,
  useTheme,
} from "degen";
import { motion, AnimatePresence } from "framer-motion";
import { matchSorter } from "match-sorter";
import { FC, useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";
import styled from "styled-components";
import { smartTrim } from "../../utils/utils";
import { useOutsideAlerter } from "../Popover";
import { Portal } from "../Portal/portal";

export type OptionType = {
  label: string;
  value: string;
};

interface Props {
  title?: string;
  options: OptionType[];
  selected: OptionType;
  onChange: (option: OptionType) => void;
}

// const OptionsContainer = styled(Box)<{ isExpanded: boolean }>`
//   display: ${(props) => (props.isExpanded ? "block" : "none")};
//   position: absolute;
//   z-index: 1;
//   width: 20rem;
// `;

const Option = styled(Box)<{ mode: string }>`
  cursor: pointer;
  &:hover {
    background-color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 20, 20, 0.1)"};
  }
`;

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 10px;
  }
  height: 9.5rem;
  overflow-y: auto;
  width: 20rem;
`;

const slide = {
  hidden: { height: 0, opacity: 0 },
  open: { height: "10rem", opacity: 1 },
  collapsed: { height: 0, opacity: 0 },
};

const Dropdown: FC<Props> = ({ options, selected, onChange, title }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState(selected?.label);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const { mode } = useTheme();
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setIsExpanded, false);

  const [anchorElement, setAnchorElement] = useState<any>();
  const [popperElement, setPopperElement] = useState<any>();

  const { styles, attributes } = usePopper(anchorElement, popperElement, {
    placement: "bottom-start",
  });

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  return (
    <>
      <Box style={{ width: "20rem" }}>
        <Input
          ref={setAnchorElement}
          label={title}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setFilteredOptions(
              matchSorter(options, e.target.value, {
                keys: ["label"],
              })
            );
          }}
          suffix={
            <Button
              shape="circle"
              size="small"
              variant="transparent"
              onClick={() => {
                // inputRef.current?.focus();
                setIsExpanded(!isExpanded);
              }}
            >
              <Box
                transitionDuration="700"
                style={{
                  transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                }}
              >
                <IconChevronRight color="textTertiary" size="5" />
              </Box>
            </Button>
          }
          onFocus={() => setIsExpanded(true)}
        />
      </Box>
      {/* <OptionsContainer
        isExpanded={isExpanded}
        borderWidth="0.5"
        backgroundColor="backgroundSecondary"
        borderRadius="large"
        ref={wrapperRef}
      > */}
      <AnimatePresence>
        {isExpanded && (
          <Portal>
            <Box
              position="absolute"
              zIndex="10"
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
            >
              <motion.div
                key="content"
                initial="hidden"
                animate="open"
                exit="collapsed"
                variants={slide}
                transition={{ duration: 0.3 }}
              >
                <ScrollContainer
                  backgroundColor="background"
                  borderWidth="0.5"
                  borderRadius="2xLarge"
                  ref={wrapperRef}
                >
                  {filteredOptions?.map((option) => (
                    <Option
                      key={option.value}
                      padding="4"
                      borderRadius="3xLarge"
                      mode={mode}
                      onClick={() => {
                        onChange(option);
                        setInputValue(option.label);
                        setIsExpanded(false);
                      }}
                    >
                      <Stack align="center">
                        <Text>{smartTrim(option.label, 24)}</Text>
                      </Stack>
                    </Option>
                  ))}
                  {!filteredOptions?.length && (
                    <Option padding="4" borderRadius="3xLarge" mode={mode}>
                      <Stack align="center">
                        <Text variant="label">Not Found</Text>
                      </Stack>
                    </Option>
                  )}
                </ScrollContainer>
              </motion.div>
            </Box>
          </Portal>
        )}
      </AnimatePresence>
      {/* </OptionsContainer> */}
    </>
  );
};

export default Dropdown;

export type { Props as DropdownProps };
