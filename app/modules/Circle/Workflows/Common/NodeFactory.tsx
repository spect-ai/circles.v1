import { FlowData } from "@avp1598/spect-shared-types";
import { PopoverOption } from "./MiscComponents";
import { NodeComponent } from "./NodeComponent";
import { Node, NodeProps } from "reactflow";
import { v4 as uuid } from "uuid";

export interface IFlowNodeProps<T> {
  data: T;
  onChange: (nodeId: string, data: T) => void;
  setShowLogs: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  runData?: FlowData[string];
}

type Field<T> = {
  label: string;
  value: keyof T;
  type: "text" | "number" | "boolean" | "url" | "date" | "file" | "password";
  description: string;
  placeholder: string;
};

type Input = {
  required: boolean;
  name: string;
};

type Output = {
  name: string;
};

class NodeFactory<T extends Record<string, string>> {
  label: string;
  description: string;
  type: string;
  icon: React.ReactNode;
  fields: Field<T>[];
  inputs?: Input[];
  outputs?: Output[];
  NodeComponent: React.FC<NodeProps<IFlowNodeProps<T>>>;
  PopoverComponent: React.FC<{
    setIsPopoverOpen: (isOpen: boolean) => void;
    setNodes: (nodes: any) => void;
    onChange: (nodeId: string, data: T) => void;
    onDelete: (nodeId: string) => void;
    setShowLogs: (nodeId: string) => void;
  }>;
  validateNode: (data: T) => boolean;

  constructor({
    label,
    description,
    type,
    icon,
    fields,
    validateNode,
    inputs,
    outputs,
  }: {
    label: string;
    description: string;
    type: string;
    icon: React.ReactNode;
    fields: Field<T>[];
    validateNode: (data: T) => boolean;
    inputs?: Input[];
    outputs?: Output[];
  }) {
    this.label = label;
    this.description = description;
    this.type = type;
    this.icon = icon;
    this.fields = fields;
    this.validateNode = validateNode;
    this.inputs = inputs;
    this.outputs = outputs;

    this.NodeComponent = ({
      data: { data, onChange, runData, setShowLogs, onDelete },
      id,
    }: NodeProps<IFlowNodeProps<T>>) => {
      return (
        <NodeComponent
          nodeName={this.type}
          icon={this.icon}
          inputs={this.inputs || []}
          outputs={this.outputs || []}
          fields={this.fields.map((field) => ({
            name: field.label,
            type: field.type,
            description: field.description,
            defaultValue: data && data[field.value],
            placeholder: field.placeholder,
            onChange: (value) => {
              onChange(id, { ...data, [field.value]: value });
            },
          }))}
          runData={runData}
          setShowLogs={setShowLogs}
          onDelete={() => onDelete(id)}
        />
      );
    };
    this.PopoverComponent = ({
      setIsPopoverOpen,
      setNodes,
      onChange,
      onDelete,
      setShowLogs,
    }) => {
      return (
        <PopoverOption
          text={this.label}
          description={this.description}
          onClick={() => {
            setIsPopoverOpen(false);
            setNodes((nds: Node[]) =>
              nds.concat({
                id: uuid(),
                type: this.type,
                position: { x: 250, y: 250 },
                data: {
                  data: {
                    ...Object.fromEntries(
                      this.fields.map((field) => [field.value, ""])
                    ),
                  },
                  onChange,
                  setShowLogs,
                  onDelete,
                  runData: "",
                },
              })
            );
          }}
        />
      );
    };
  }
}

export default NodeFactory;
