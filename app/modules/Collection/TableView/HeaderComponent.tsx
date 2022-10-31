import Popover from "@/app/common/components/Popover";
import {
  Box,
  IconDotsHorizontal,
  IconPencil,
  Stack,
  Text,
  useTheme,
} from "degen";
import React, { useState } from "react";
import styled from "styled-components";

type Props = {
  sortData: (columnName: string, asc: boolean) => void;
  columnName: string;
  setPropertyName: (name: string) => void;
  setIsEditFieldOpen: (value: boolean) => void;
};

type PopoverOptionProps = {
  onClick: (e?: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
  tourId?: string;
};

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: auto;
  width: 30rem;
`;

export default function HeaderComponent({
  sortData,
  columnName,
  setIsEditFieldOpen,
  setPropertyName,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover
      butttonComponent={
        <Box>
          <Stack direction="horizontal" justify="space-between">
            <Text variant="label">{columnName}</Text>
            <DropdownButton
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsOpen(!isOpen);
              }}
            >
              <Text variant="label">
                <IconDotsHorizontal size="5" />
              </Text>
            </DropdownButton>
          </Stack>
        </Box>
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <ScrollContainer
        backgroundColor="background"
        borderWidth="0.5"
        borderRadius="large"
      >
        <PopoverOption
          onClick={() => {
            setIsOpen(false);
            setIsEditFieldOpen(true);
            setPropertyName(columnName);
          }}
        >
          <Stack direction="horizontal" space="2" align="center">
            <IconPencil />
            <Text
              variant="small"
              weight="semiBold"
              ellipsis
              color="textSecondary"
            >
              Customize Field
            </Text>
          </Stack>
        </PopoverOption>

        {/* <PopoverOption
          onClick={() => {
            sortData(columnName, true);
            setIsOpen(false);
          }}
        >
          <Stack direction="horizontal" space="2" align="center">
            <Text>▲</Text>
            <Text
              variant="small"
              weight="semiBold"
              ellipsis
              color="textSecondary"
            >
              Sort Ascending
            </Text>
          </Stack>
        </PopoverOption>
        <PopoverOption
          onClick={() => {
            sortData(columnName, false);
            setIsOpen(false);
          }}
        >
          <Stack direction="horizontal" space="2" align="center">
            <Text>▼</Text>
            <Text
              variant="small"
              weight="semiBold"
              ellipsis
              color="textSecondary"
            >
              Sort Descending
            </Text>
          </Stack>
        </PopoverOption> */}
      </ScrollContainer>
    </Popover>
  );
}

const PopoverOption = ({ children, onClick, tourId }: PopoverOptionProps) => {
  const { mode } = useTheme();

  return (
    <PopoverOptionContainer
      padding="4"
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
      borderRadius="large"
      data-tour={tourId}
      mode={mode}
    >
      <Text variant="small" weight="semiBold" ellipsis color="textSecondary">
        {children}
      </Text>
    </PopoverOptionContainer>
  );
};

const PopoverOptionContainer = styled(Box)<{ mode: string }>`
  &:hover {
    background-color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 20, 20, 0.1)"};
  }
`;

const DropdownButton = styled(Box)`
  cursor: pointer !important;
`;
