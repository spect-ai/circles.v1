import Modal from "@/app/common/components/Modal";
import { Box } from "degen";
import { useRouter } from "next/router";
import { Graph } from "react-d3-graph";
import { useCircle } from "../../Circle/CircleContext";

type Props = {
  handleClose: () => void;
};

export default function Navigation({ handleClose }: Props) {
  const { navigationData } = useCircle();

  const router = useRouter();

  // the graph configuration, just override the ones you need
  const myConfig = {
    directed: true,
    nodeHighlightBehavior: false,
    panAndZoom: true,
    d3: {
      alphaTarget: 0.05,
      gravity: -100,
      linkLength: 120,
      linkStrength: 1,
      disableLinkForce: false,
    },
    node: {
      color: "rgb(191, 90, 242, 0.8)",
      size: 2500,
      highlightStrokeColor: "blue",
      fontColor: "rgb(255, 255, 255, 0.8)",
      fontSize: 14,
      highlightFontSize: 14,
      labelPosition: "center" as any,
      labelProperty: (d: any) => d.title,
    },
    link: {
      highlightColor: "lightblue",
    },
    freezeAllDragEvents: true,
  };

  const onClickNode = async (nodeId: string) => {
    await router.push(`/${nodeId}`);
    handleClose();
    console.log({ nodeId });
    // window.alert(`Clicked node ${nodeId}`);
  };

  const onClickLink = function (source: any, target: any) {
    window.alert(`Clicked link between ${source} and ${target}`);
  };

  return (
    <Modal handleClose={handleClose} title="Circle Map">
      <Box padding="8">
        {navigationData && (
          <Graph
            id="graph-id" // id is mandatory
            data={navigationData}
            config={myConfig}
            onClickNode={onClickNode}
            onClickLink={onClickLink}
          />
        )}
      </Box>
    </Modal>
  );
}
