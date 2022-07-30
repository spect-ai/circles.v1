import { Box, Button, IconChevronRight, Input, Stack, Text } from "degen";
import { motion, AnimatePresence } from "framer-motion";
import { matchSorter } from "match-sorter";
import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";

export type OptionType = {
  name: string;
  id: string;
};

interface Props {
  title?: string;
  options: OptionType[];
  selected?: OptionType;
  onChange: (option: OptionType) => void;
}

const OptionsContainer = styled(Box)<{ isExpanded: boolean }>`
  display: ${(props) => (props.isExpanded ? "block" : "none")};
  position: absolute;
  z-index: 1;
  width: 20rem;
  max-height: 15rem;
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
  max-height: 15rem;
  overflow-y: auto;
`;

const slide = {
  hidden: { height: 0, opacity: 0 },
  open: { height: "10rem", opacity: 1 },
  collapsed: { height: 0, opacity: 0 },
};

const MultipleDropdown: FC<Props> = ({ options, selected, onChange, title }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // use input ref
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(selected?.id);
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  return (
    <>
      <Box style={{ width: "20rem", marginBottom: "0.5rem",}} onClick={(() => setIsExpanded(!isExpanded))} >
        <Input
          ref={inputRef}
          label={title}
          hideLabel
          placeholder={title}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setFilteredOptions(
              matchSorter(options, e.target.value, {
                keys: ["name"],
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
                    key={option.id}
                    padding="3"
                    borderRadius="3xLarge"
                    onClick={() => {
                      onChange(option);
                      setInputValue(option.name);
                      setIsExpanded(false);
                    }}
                  >
                    <Stack align="center">
                      <Text>{option.name}</Text>
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

export default MultipleDropdown;

export type { Props as DropdownProps };
