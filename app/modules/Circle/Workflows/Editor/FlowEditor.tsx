import { useCallback, useEffect, useRef, useState } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
} from "reactflow";
import Modal from "@/app/common/components/Modal";
import {
  Box,
  Button,
  Heading,
  IconChevronLeft,
  IconLightningBolt,
  IconUpload,
  Spinner,
  Stack,
  Tag,
  Text,
  Textarea,
  useTheme,
} from "degen";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  Flow,
  FlowConfig,
  FlowData,
  flowConfigSchema,
} from "@avp1598/spect-shared-types";
import { getFlow, runFlow, updateFlow } from "@/app/services/Workflows";
import Link from "next/link";
import { useRouter } from "next/router";
import AddNodePopover from "./AddNodePopover";
import { Tooltip } from "react-tooltip";
import { ToastContainer, toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import ViewRuns from "./ViewRuns";
import { v4 as uuid } from "uuid";
import { Sources } from "../Nodes/Sources";
import { Outputs } from "../Nodes/Outputs";
import { validateNode } from "../Common/Utils";

type Props = {
  flow: Flow;
  setEditingFlow: (flow: Flow | undefined) => void;
};

const sourceNodeTypes = Sources.reduce((acc, source) => {
  acc[source.type] = source.NodeComponent;
  return acc;
}, {} as Record<string, any>);

const outputNodeTypes = Outputs.reduce((acc, output) => {
  acc[output.type] = output.NodeComponent;
  return acc;
}, {} as Record<string, any>);

const nodeTypes = {
  ...sourceNodeTypes,
  ...outputNodeTypes,
};

const FlowEditor = ({ flow, setEditingFlow }: Props) => {
  const reactFlowWrapper = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [flowRunningModal, setFlowRunningModal] = useState(false);
  const [formLink, setFormLink] = useState("");
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const { circle: cId } = useRouter().query;
  const { mode } = useTheme();
  const [flowData, setFlowData] = useState<FlowData>({});
  const [showLogs, setShowLogs] = useState("");
  const [flowConfig, setFlowConfig] = useState<FlowConfig>();

  const onDeleteNode = useCallback(
    (nodeId: any) => {
      setNodes((nds) => nds.filter((nd) => nd.id !== nodeId));
      setEdges((eds) => eds.filter((ed) => ed.source !== nodeId));
    },
    [setNodes, setEdges]
  );

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const reactFlowBounds = (
        reactFlowWrapper.current as any
      ).getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = (reactFlowInstance as any).project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: uuid(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeDataUpdate = useCallback(
    (nodeId: any, data: any) => {
      setNodes((nds) =>
        nds.map((nd) =>
          nd.id === nodeId
            ? {
                ...nd,
                data: {
                  ...nd.data,
                  data,
                },
              }
            : nd
        )
      );
    },
    [setNodes]
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onSave = useCallback(async () => {
    const flowConfig = {
      nodes: nodes.map((node) => ({
        ...node,
        data: node.data.data,
      })),
      edges,
    };

    for (const node of nodes) {
      validateNode(node);
    }
    console.log({ flowConfig });
    setSaving(true);
    const res = await updateFlow(
      {
        flowConfig: flowConfigSchema.parse(flowConfig),
      },
      flow.id
    );
    setSaving(false);
    if (!res) toast.error("Error saving flow");
  }, [nodes, edges]);

  useEffect(() => {
    if (flowData && flowConfig) {
      (async () => {
        const newNodes = flowConfig.nodes.map((node) => {
          return {
            ...node,
            data: {
              data: node.data,
              onChange: onNodeDataUpdate,
              runData: flowData[node.id],
              setShowLogs,
              onDelete: onDeleteNode,
            },
          };
        });
        setNodes(newNodes);
        setEdges(flowConfig.edges);
      })();
    }
  }, [flowData, flowConfig]);

  useEffect(() => {
    setFlowData(flow.flowData);
  }, []);

  useEffect(() => {
    setFlowConfig(flow.flowConfig);
  }, []);

  return (
    <ReactFlowProvider>
      <ToastContainer
        toastStyle={{
          backgroundColor: `${
            mode === "dark" ? "rgb(20,20,20)" : "rgb(240,240,240)"
          }`,
          color: `${
            mode === "dark" ? "rgb(255,255,255,0.7)" : "rgb(20,20,20,0.7)"
          }`,
        }}
      />
      <Box id="container" height="full" width="full" position="relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance as any}
          onDrop={onDrop}
          onDragOver={onDragOver}
          proOptions={{
            hideAttribution: true,
          }}
          nodeTypes={nodeTypes}
          fitView={flow.flowConfig.nodes.length > 1}
        >
          <Background />
          <Controls />
        </ReactFlow>
        <AnimatePresence>
          {flowRunningModal && (
            <Modal
              title="Running flow"
              handleClose={() => setFlowRunningModal(false)}
              size="small"
            >
              <Box padding="8">
                <Stack>
                  {running && (
                    <Stack>
                      <Text variant="label">
                        Please wait, while we run the flow
                      </Text>
                      <Spinner size="large" />
                    </Stack>
                  )}
                  {formLink && !running && (
                    <Stack>
                      <Text variant="label">Flow finished!</Text>
                      <Stack direction="horizontal" align="center">
                        <Link href={`${cId}/r/${formLink}`}>
                          <PrimaryButton>Go to form</PrimaryButton>
                        </Link>
                      </Stack>
                    </Stack>
                  )}
                  {!formLink && !running && (
                    <Stack>
                      <Text variant="label">Error in running flow</Text>
                      <Text>
                        Check the nodes on the editor to see which node failed
                      </Text>
                    </Stack>
                  )}
                </Stack>
              </Box>
            </Modal>
          )}
          {showLogs && (
            <Modal
              title="Node logs"
              handleClose={() => setShowLogs("")}
              size="small"
            >
              <Box padding="8">
                <Stack>
                  <Tag
                    tone={
                      flowData[showLogs]?.status === "success"
                        ? "green"
                        : flowData[showLogs]?.status === "error"
                        ? "red"
                        : undefined
                    }
                  >
                    {flowData[showLogs]?.status}
                  </Tag>
                  <Textarea
                    defaultValue={flowData[showLogs]?.data}
                    label="Data"
                    disabled
                    description="This is the data that the node returned"
                  />
                  <Textarea
                    defaultValue={flowData[showLogs]?.error}
                    label="Error Message"
                    disabled
                    description="This is the error message if the node failed"
                  />
                  <Textarea
                    defaultValue={flowData[showLogs].cacheKey}
                    label="Cache Key"
                    disabled
                    description="This is the key to check if the node needs to be run again"
                  />
                </Stack>
              </Box>
            </Modal>
          )}
        </AnimatePresence>
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            padding: "1rem",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="horizontal">
            <Button
              onClick={() => {
                setEditingFlow(undefined);
              }}
              shape="circle"
              size="small"
              variant="tertiary"
            >
              <IconChevronLeft />
            </Button>
            <ViewRuns runs={flow.runs} />
            <AddNodePopover
              setNodes={setNodes}
              onNodeDataUpdate={onNodeDataUpdate}
              setShowLogs={setShowLogs}
              onDeleteNode={onDeleteNode}
            />
          </Stack>
          <Box>
            <Heading>{flow.name}</Heading>
          </Box>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {/* <Tooltip title="Save Flow"> */}
            <Button
              loading={saving}
              shape="circle"
              size="small"
              variant="tertiary"
              onClick={onSave}
            >
              <IconUpload />
            </Button>
            {/* </Tooltip> */}
            {/* <Tooltip title="Run Flow"> */}
            <Button
              shape="circle"
              size="small"
              variant="secondary"
              onClick={async () => {
                await onSave();
                setFlowRunningModal(true);
                setRunning(true);
                const res = await runFlow(flow.id);
                if (!res) {
                  setRunning(false);
                  setFlowRunningModal(false);
                  return;
                }
                const updatedFlow = await getFlow(flow.id);
                if (updatedFlow) {
                  setFlowData(updatedFlow.flowData);
                  setFlowConfig(updatedFlow.flowConfig);
                }
                if (res) {
                  if (!res.formSlug) {
                    setFormLink("");
                    setRunning(false);
                    return;
                  }
                  setFormLink(res.formSlug.toString());
                }
                setRunning(false);
              }}
            >
              <IconLightningBolt />
            </Button>
            {/* </Tooltip> */}
          </Box>
        </Box>
      </Box>
    </ReactFlowProvider>
  );
};

export default FlowEditor;
