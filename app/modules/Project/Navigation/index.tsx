// import React, { Component, useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import Modal from "@/app/common/components/Modal";
// import { default as nodeConfig, NODE_KEY } from "./config";
// import { useRouter } from "next/router";
// import { useCircle } from "@/app/modules/Circle/CircleContext";

// const GraphView = dynamic(() => import("react-digraph"), {
//   ssr: false,
// });

// interface Props {
//   setGraphOpen: (graphOpen: boolean) => void;
// }

// interface NodeType {
//   id: string;
//   title: string;
//   slug: string;
// }

// interface EdgeType {
//   source: string;
//   target: string;
// }

// interface Selected {
//   edges: EdgeType;
//   nodes: NodeType;
// }

// export function Nav({ setGraphOpen }: Props) {
//   const router = useRouter();
//   const { circle } = useCircle();

//   const [edges, setEdges] = useState([] as EdgeType[]);
//   const [nodes, setNodes] = useState([] as NodeType[]);

//   const fetchNavigation = async () => {
//     const res = await fetch(
//       `${process.env.API_HOST}/circle/v1/${circle?.id}/circleNav`,
//       {
//         credentials: "include",
//       }
//     );
//     if (res.ok) {
//       const data = await res.json();
//       setEdges(data.edges);
//       setNodes(data.nodes);
//       return data;
//     } else {
//       return false;
//     }
//   };

//   useEffect(() => {
//     void fetchNavigation();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [circle]);

//   const sample = {
//     edges: edges,
//     nodes: nodes,
//   };

//   class Graph extends Component {
//     state = {
//       graph: sample,
//       selected: {} as Selected,
//     };

//     getNodeIndex(searchNode: NodeType) {
//       return this.state.graph.nodes.findIndex((node) => {
//         return node[NODE_KEY] === searchNode[NODE_KEY];
//       });
//     }

//     onUpdateNode = (viewNode: NodeType) => {
//       const graph = this.state.graph;
//       const i = this.getNodeIndex(viewNode);

//       graph.nodes[i] = viewNode;
//       this.setState({ graph });
//     };

//     onSelectNode = (viewNode: NodeType, event: any) => {
//       if (event?.target !== undefined) {
//         console.log(viewNode);
//         void router.push(`/${viewNode?.slug}`);
//         this.setState({ selected: viewNode });
//       }
//     };

//     render() {
//       const nodes = this.state.graph.nodes;
//       const edges = this.state.graph.edges;
//       const selected = this.state.selected;

//       return (
//         <Modal
//           title="Navigation"
//           height="large"
//           handleClose={() => setGraphOpen(false)}
//         >
//           <div id="graph" style={{ height: "50rem" }}>
//             <GraphView
//               showGraphControls={true}
//               gridSize={100}
//               gridDotSize={1}
//               nodeKey={NODE_KEY}
//               nodes={nodes}
//               edges={edges}
//               // selected={selected} // required
//               nodeTypes={nodeConfig.NodeTypes}
//               nodeSubtypes={nodeConfig.NodeSubtypes}
//               edgeTypes={nodeConfig.NodeTypes}
//               // onSelectNode={this.onSelectNode} // required
//               // onUpdateNode={this.onUpdateNode} // required
//               readOnly={false}
//             />
//           </div>
//         </Modal>
//       );
//     }
//   }

//   return <Graph />;
// }
