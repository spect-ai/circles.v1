import Popover from "@/app/common/components/Popover";
import styled from "@emotion/styled";
import { Box, Button, IconPlus, Text, useTheme } from "degen";
import React, { useState } from "react";
import { Sources } from "../Nodes/Sources";
import { Outputs } from "../Nodes/Outputs";

type Props = {
  setNodes: (nodes: any) => void;
  onNodeDataUpdate: (nodeId: string, data: any) => void;
  setShowLogs: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
};

const AddNodePopover = ({
  setNodes,
  onNodeDataUpdate,
  setShowLogs,
  onDeleteNode,
}: Props) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { mode } = useTheme();

  return (
    <Popover
      butttonComponent={
        <Box width="1/4">
          <Button
            onClick={() => {
              setIsPopoverOpen(true);
            }}
            shape="circle"
            size="small"
            variant="secondary"
          >
            <IconPlus />
          </Button>
        </Box>
      }
      isOpen={isPopoverOpen}
      setIsOpen={setIsPopoverOpen}
    >
      <Box
        backgroundColor="background"
        borderRadius="2xLarge"
        width="72"
        style={{
          boxShadow:
            mode === "dark"
              ? "0px 0px 10px rgba(0, 0, 0, 0.5)"
              : "0px 0px 10px rgba(255, 255, 255, 0.5)",
        }}
      >
        <Box borderBottomWidth="0.375">
          <Box paddingX="4" paddingTop="4" paddingBottom="2">
            <Text variant="label">Sources</Text>
          </Box>
          {Sources.map((Source) => {
            return (
              <Source.PopoverComponent
                setIsPopoverOpen={setIsPopoverOpen}
                setNodes={setNodes}
                onChange={onNodeDataUpdate}
                onDelete={onDeleteNode}
                setShowLogs={setShowLogs}
              />
            );
          })}
        </Box>
        <Box>
          <Box paddingX="4" paddingTop="4" paddingBottom="2">
            <Text variant="label">Outputs</Text>
          </Box>
          {Outputs.map((Output) => {
            return (
              <Output.PopoverComponent
                setIsPopoverOpen={setIsPopoverOpen}
                setNodes={setNodes}
                onChange={onNodeDataUpdate}
                onDelete={onDeleteNode}
                setShowLogs={setShowLogs}
              />
            );
          })}
        </Box>
      </Box>
    </Popover>
  );
};

const PopoverOptionContainer = styled(Box)<{ mode: string }>`
  &:hover {
    background-color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(20, 20, 20, 0.05)"};
  }
  transition: background-color 0.2s ease-in-out;
`;

type PopoverOptionProps = {
  onClick: (e?: React.MouseEvent<HTMLElement>) => void;
  text: string;
  description: string;
};

export const PopoverOption = ({
  onClick,
  text,
  description,
}: PopoverOptionProps) => {
  const { mode } = useTheme();

  return (
    <PopoverOptionContainer
      padding="4"
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
      borderRadius="2xLarge"
      mode={mode}
    >
      <Text ellipsis weight="semiBold">
        {text}
      </Text>
      <Text size="extraSmall" color="textTertiary">
        {description}
      </Text>
    </PopoverOptionContainer>
  );
};

export default AddNodePopover;
