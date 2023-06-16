import Popover from "@/app/common/components/Popover";
import styled from "@emotion/styled";
import { Box, Button, IconPlus, Text, useTheme } from "degen";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Node } from "reactflow";
import { v4 as uuid } from "uuid";

type Props = {
  setNodes: (nodes: any) => void;
  onNodeDataUpdate: (node: any) => void;
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
        <PopoverOption
          onClick={() => {
            setIsPopoverOpen(false);
            setNodes((nds: any) =>
              nds.concat({
                id: uuid(),
                type: "mirror",
                position: { x: 250, y: 250 },
                data: {
                  url: "",
                  onChange: onNodeDataUpdate,
                  setShowLogs,
                },
              })
            );
          }}
          text="Mirror"
          description="Blog posts from your mirror page"
        />
        <PopoverOption
          onClick={() => {
            setIsPopoverOpen(false);
            setNodes((nds: any) =>
              nds.concat({
                id: uuid(),
                type: "youtube",
                position: { x: 250, y: 250 },
                data: {
                  channelId: "",
                  filter: "",
                  onChange: onNodeDataUpdate,
                  setShowLogs,
                },
              })
            );
          }}
          text="Youtube"
          description="Youtube transcripts from your channel"
        />
        <PopoverOption
          onClick={() => {
            setIsPopoverOpen(false);
            setNodes((nds: any) =>
              nds.concat({
                id: uuid(),
                type: "reddit",
                position: { x: 250, y: 250 },
                data: {
                  channelId: "",
                  filter: "",
                  onChange: onNodeDataUpdate,
                  setShowLogs,
                },
              })
            );
          }}
          text="Reddit"
          description="Reddit posts from your subreddit"
        />
        <PopoverOption
          onClick={() => {
            setIsPopoverOpen(false);
            setNodes((nds: Node[]) => {
              if (nds.filter((n) => n.type === "summarizer").length > 0) {
                toast.warn("Only one summarizer node can be added");
                return nds;
              } else {
                return nds.concat({
                  id: uuid(),
                  type: "summarizer",
                  position: { x: 350, y: 250 },
                  data: {
                    channelId: "",
                    filter: "",
                    onChange: onNodeDataUpdate,
                    setShowLogs,
                    onDelete: onDeleteNode,
                  },
                });
              }
            });
          }}
          text="Summarizer Form"
          description="Interactive form giving you a summary of your sources"
        />
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
