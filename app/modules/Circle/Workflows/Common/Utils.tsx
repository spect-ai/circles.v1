import { Node } from "reactflow";
import { Sources } from "../Nodes/Sources";
import { Outputs } from "../Nodes/Outputs";

export function validateNode(node: Node) {
  const { type, data } = node;

  const SourceNode = Sources.find((source) => source.type === type);

  if (!SourceNode) {
    const OutputNode = Outputs.find((output) => output.type === type);
    if (!OutputNode) {
      throw new Error("Invalid node type");
    }
    OutputNode.validateNode(data.data);
  } else {
    SourceNode.validateNode(data.data);
  }
}
