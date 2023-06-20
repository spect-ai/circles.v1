import {
  SnapshotNodeData,
  snapshotNodeDataSchema,
} from "@avp1598/spect-shared-types";
import NodeFactory from "../../../Common/NodeFactory";
import { isURL } from "@/app/common/utils/utils";
import { toast } from "react-toastify";

const Snapshot = new NodeFactory<SnapshotNodeData>({
  label: "Snapshot",
  description: "Proposals from your snapshot space",
  type: "snapshot",
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
    data = snapshotNodeDataSchema.parse(data);
    if (!data.url || !isURL(data.url) || !data.url.includes("snapshot.org")) {
      toast.error("Please enter a valid Snapshot URL on the Snapshot node");
      return false;
    }
    const space = data.url.split("/").pop();
    if (!space || !space.includes(".eth")) {
      toast.error(
        "Please enter a valid Snapshot URL on the Snapshot node, space invalid"
      );
      return false;
    }
    return true;
  },
  fields: [
    {
      label: "Snapshot space url",
      value: "url",
      type: "url",
      description: "The url of your snapshot space",
      placeholder: "https://snapshot.org/#/hop.eth",
    },
  ],
});

export default Snapshot;
