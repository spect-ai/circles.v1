import {
  YoutubeNodeData,
  youtubeNodeDataSchema,
} from "@avp1598/spect-shared-types";
import NodeFactory from "../../../Common/NodeFactory";
import { toast } from "react-toastify";

const Youtube = new NodeFactory<YoutubeNodeData>({
  label: "Youtube",
  description: "Youtube transcripts from your channel",
  type: "youtube",
  icon: (
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
  ),
  inputs: [],
  outputs: [
    {
      name: "Transcript",
    },
  ],
  validateNode: (data) => {
    data = youtubeNodeDataSchema.parse(data);
    if (!data.channelId || !data.channelId.length) {
      toast.error("Youtube node is missing channel id, please add that");
      return false;
    }
    if (!data.filter || !data.filter.length) {
      toast.error("Youtube node is missing filter, please add that");
      return false;
    }
    return true;
  },
  fields: [
    {
      label: "Youtube channel handle",
      value: "channelId",
      type: "url",
      description: "Please enter the handle of the youtube channel",
      placeholder: "@guildxyz",
    },
    {
      label: "Filter",
      value: "filter",
      type: "text",
      description:
        "Please enter the filter you want to apply to the youtube channel",
      placeholder: "Community Call",
    },
  ],
});

export default Youtube;
