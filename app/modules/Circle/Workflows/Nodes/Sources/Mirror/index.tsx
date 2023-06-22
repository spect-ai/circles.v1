import {
  MirrorNodeData,
  mirrorNodeDataSchema,
} from "@avp1598/spect-shared-types";
import NodeFactory from "../../../Common/NodeFactory";
import { isURL } from "@/app/common/utils/utils";
import { toast } from "react-toastify";

const Mirror = new NodeFactory<MirrorNodeData>({
  label: "Mirror",
  description: "Blog posts from your mirror page",
  type: "mirror",
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
      name: "Text Output",
    },
  ],
  validateNode: (data) => {
    data = mirrorNodeDataSchema.parse(data);
    if (!data.url || !isURL(data.url) || !data.url.includes("mirror.xyz")) {
      toast.error("Please enter a valid Mirror URL on the Mirror node");
      return false;
    }
    return true;
  },
  fields: [
    {
      label: "Mirror Url",
      value: "url",
      type: "url",
      description: "The url of your mirror blog",
      placeholder: "https://guild.mirror.xyz/",
    },
  ],
});

export default Mirror;
