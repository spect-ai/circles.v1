import { Box, Button, IconChevronRight, Input, Stack, Text } from "degen";
import { motion, AnimatePresence } from "framer-motion";
import { matchSorter } from "match-sorter";
import { FC, useRef, useState } from "react";
import styled from "styled-components";

type OptionType = {
  label: string;
  value: string;
};

interface Props {
  options: OptionType[];
  selected: OptionType;
  onChange: (option: OptionType) => void;
}

const OptionsContainer = styled(Box)<{ isExpanded: boolean }>`
  display: ${(props) => (props.isExpanded ? "block" : "none")};
  position: absolute;
  z-index: 1;
  width: 20rem;
`;

const Option = styled(Box)`
  cursor: pointer;
  &:hover {
    background-color: rgb(255, 255, 255, 0.1);
  }
`;

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: 9.5rem;
  overflow-y: auto;
`;

const slide = {
  hidden: { height: 0, opacity: 0 },
  open: { height: "10rem", opacity: 1 },
  collapsed: { height: 0, opacity: 0 },
};

const Dropdown: FC<Props> = ({ options, selected, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // use input ref
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(selected?.label);
  const [filteredOptions, setFilteredOptions] = useState(options);
  return (
    <>
      <Box style={{ width: "20rem" }}>
        <Input
          ref={inputRef}
          label={""}
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
                inputRef.current?.focus();
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
          onBlur={() =>
            setTimeout(() => {
              setIsExpanded(false);
            }, 100)
          }
          onFocus={() => setIsExpanded(true)}
        />
      </Box>
      <OptionsContainer
        isExpanded={isExpanded}
        borderWidth="0.5"
        backgroundColor="backgroundSecondary"
        borderRadius="3xLarge"
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="content"
              initial="hidden"
              animate="open"
              exit="collapsed"
              variants={slide}
              transition={{ duration: 0.3 }}
            >
              <ScrollContainer>
                {filteredOptions.map((option) => (
                  <Option
                    key={option.value}
                    padding="4"
                    borderRadius="3xLarge"
                    onClick={() => {
                      onChange(option);
                      setInputValue(option.label);
                    }}
                  >
                    <Stack align="center">
                      <Text>{option.label}</Text>
                    </Stack>
                  </Option>
                ))}
                {!filteredOptions.length && (
                  <Option padding="4" borderRadius="3xLarge">
                    <Stack align="center">
                      <Text variant="label">Not Found</Text>
                    </Stack>
                  </Option>
                )}
              </ScrollContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </OptionsContainer>
    </>
  );
};

export default Dropdown;

export type { Props as DropdownProps };
