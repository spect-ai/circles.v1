import { NodeProps } from "reactflow";
import { NodeComponent } from "../NodeComponent";
import { FlowData } from "@avp1598/spect-shared-types";

type RedditNodeMetadata = {
  url: string;
  filter: string;
  onChange: (obj: { url: string; filter: string; id: string }) => void;
  setShowLogs: (value: string) => void;
  onDelete: (nodeId: string) => void;
  runData?: FlowData[string];
};

function RedditNode({
  data: { url, filter, onChange, runData, setShowLogs, onDelete },
  id,
}: NodeProps<RedditNodeMetadata>) {
  return (
    <NodeComponent
      nodeName="Reddit"
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
          name: "Posts Output",
        },
      ]}
      fields={[
        {
          name: "Subreddit URL",
          type: "url",
          description: "Please enter the url of your subreddit",
          defaultValue: url,
          placeholder: "https://www.reddit.com/r/ourguild/",
          onChange: (value) => {
            onChange({ url: value, filter: filter, id });
          },
        },
        {
          name: "Flair filter",
          type: "text",
          description: "The flair to filter the posts by",
          defaultValue: filter,
          placeholder: "Guild.Log",
          onChange: (value) => {
            onChange({ url: url, filter: value, id });
          },
        },
      ]}
      runData={runData}
      setShowLogs={setShowLogs}
      onDelete={() => onDelete(id)}
    />
  );
}

export default RedditNode;
