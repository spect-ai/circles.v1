import { FlowData } from "@avp1598/spect-shared-types";
import {
  Box,
  Button,
  Heading,
  IconTrash,
  Input,
  Stack,
  Tag,
  Text,
} from "degen";
import React from "react";
import { Handle, Position } from "reactflow";

type props = {
  nodeName: string;
  icon: React.ReactNode;
  outputs: {
    name: string;
  }[];
  inputs: {
    name: string;
    required: boolean;
  }[];
  fields: {
    name: string;
    type: "text" | "number" | "boolean" | "url" | "date" | "file" | "password";
    description: string;
    defaultValue: string;
    onChange: (value: string) => void;
  }[];
  setShowLogs: (nodeId: string) => void;
  onDelete: () => void;
  runData?: FlowData[string];
};

export const NodeComponent = ({
  nodeName,
  icon,
  outputs,
  inputs,
  fields,
  setShowLogs,
  onDelete,
  runData,
}: props) => {
  return (
    <Box
      backgroundColor="background"
      borderRadius="2xLarge"
      width="96"
      borderWidth="0.375"
      borderColor={runData?.status === "error" ? "red" : undefined}
    >
      <Stack>
        <Box borderBottomWidth="0.375" padding="4">
          <Stack direction="horizontal" justify="space-between">
            <Heading>{nodeName}</Heading>
            <Button
              size="small"
              variant="transparent"
              shape="circle"
              onClick={onDelete}
            >
              <IconTrash color="red" />
            </Button>
          </Stack>
          <Stack direction="horizontal" space="2">
            {runData?.status === "error" && (
              <Box marginTop="1">
                <Stack>
                  <Tag tone="red">Node failed</Tag>
                </Stack>
              </Box>
            )}
            {runData && (
              <Box marginTop="1">
                <Stack>
                  <button
                    style={{
                      border: "none",
                      outline: "none",
                      background: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowLogs(runData.nodeId)}
                  >
                    <Tag hover>View logs</Tag>
                  </button>
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
        <Box
          className="flex flex-col gap-4 p-4"
          display="flex"
          flexDirection="column"
          gap="4"
          padding="4"
        >
          {inputs.map((input) => (
            <Box key={input.name} marginBottom="4">
              <Handle
                type="source"
                position={Position.Left}
                style={{
                  top: 115,
                }}
              />
              <Text>
                {input.name}{" "}
                {input.required && (
                  <span style={{ color: "red" }}>&nbsp;*</span>
                )}
              </Text>
            </Box>
          ))}
          {fields.map((field) => (
            <Input
              key={field.name}
              label={field.name}
              description={field.description}
              defaultValue={field.defaultValue}
              onChange={(e) => field.onChange(e.target.value)}
              required
              type={field.type as any}
            />
          ))}
          {outputs.map((output, idx) => (
            <div className="" key={output.name}>
              <Handle
                type="target"
                position={Position.Right}
                style={{
                  bottom: 20,
                  top: "auto",
                }}
              />
              <Box
                style={{
                  float: "right",
                }}
              >
                <Text>{output.name}</Text>
              </Box>
            </div>
          ))}
        </Box>
      </Stack>
    </Box>
  );
};
