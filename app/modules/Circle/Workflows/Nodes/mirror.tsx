import { NodeProps } from "reactflow";
import { NodeComponent } from "../NodeComponent";
import { FlowData } from "@avp1598/spect-shared-types";

type MirrorNodeMetadata = {
  url: string;
  onChange: (obj: { url: string; id: string }) => void;
  setShowLogs: (value: string) => void;
  onDelete: (nodeId: string) => void;
  runData?: FlowData[string];
};

function MirrorNode({
  data: { url, onChange, runData, setShowLogs, onDelete },
  id,
}: NodeProps<MirrorNodeMetadata>) {
  return (
    <NodeComponent
      nodeName="Mirror"
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
          name: "Text Output",
        },
      ]}
      fields={[
        {
          name: "Mirror Url",
          type: "url",
          description: "The url of your mirror blog",
          defaultValue: url,
          placeholder: "https://guild.mirror.xyz/",
          onChange: (value) => {
            onChange({ url: value, id });
          },
        },
      ]}
      runData={runData}
      setShowLogs={setShowLogs}
      onDelete={() => onDelete(id)}
    />
  );
}

export default MirrorNode;
