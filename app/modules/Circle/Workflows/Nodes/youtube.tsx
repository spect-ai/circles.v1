import { NodeProps } from "reactflow";
import { NodeComponent } from "../NodeComponent";
import { FlowData } from "@avp1598/spect-shared-types";

type YoutubeNodeMetadata = {
  channelId: string;
  filter: string;
  onChange: (obj: { channelId: string; filter: string; id: string }) => void;
  setShowLogs: (value: string) => void;
  onDelete: (nodeId: string) => void;
  runData?: FlowData[string];
};

function YoutubeNode({
  data: { channelId, filter, onChange, runData, setShowLogs, onDelete },
  id,
}: NodeProps<YoutubeNodeMetadata>) {
  return (
    <NodeComponent
      nodeName="Youtube"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      }
      inputs={[]}
      outputs={[
        {
          name: "Transcript",
        },
      ]}
      fields={[
        {
          name: "Youtube channel ID",
          type: "url",
          description:
            "Please enter the channel Id of the youtube channel you want to get the videos from",
          defaultValue: channelId,
          onChange: (value) => {
            onChange({ channelId: value, filter: filter, id });
          },
        },
        {
          name: "Filter",
          type: "text",
          description:
            "Please enter the filter you want to apply to the youtube channel",
          defaultValue: filter,
          onChange: (value) => {
            onChange({ channelId: channelId, filter: value, id });
          },
        },
      ]}
      runData={runData}
      setShowLogs={setShowLogs}
      onDelete={() => onDelete(id)}
    />
  );
}

export default YoutubeNode;
