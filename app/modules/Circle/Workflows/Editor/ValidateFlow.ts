import { isURL } from "@/app/common/utils/utils";
import { FlowConfig } from "@avp1598/spect-shared-types";
import { toast } from "react-toastify";

export default function validateFlow(flow: FlowConfig) {
  for (const node of flow.nodes) {
    switch (node.type) {
      case "mirror":
        if (
          !node.data.url ||
          !isURL(node.data.url) ||
          !node.data.url.includes("mirror.xyz")
        ) {
          toast.error("Please enter a valid Mirror URL on the Mirror node");
          return false;
        }
        break;
      case "reddit":
        if (
          !node.data.url ||
          !isURL(node.data.url) ||
          !node.data.url.includes("reddit.com")
        ) {
          toast.error("Please enter a valid Reddit URL on the Reddit node");
          return false;
        }
        if (!node.data.filter || !node.data.filter.length) {
          toast.error("Reddit node is missing flair filter, please add that");
          return false;
        }
        break;
      case "youtube":
        if (!node.data.channelId || !node.data.channelId.length) {
          toast.error("Youtube node is missing channel id, please add that");
          return false;
        }
        if (!node.data.filter || !node.data.filter.length) {
          toast.error("Youtube node is missing filter, please add that");
          return false;
        }
        break;
      case "summarizer":
        if (!node.data.formName || !node.data.formName.length) {
          toast.error("Summarizer node is missing form name, please add that");
          return false;
        }
        if (flow.edges.filter((edge) => edge.source === node.id).length === 0) {
          toast.error(
            "Summarizer node is missing sources, please connect atleast 1 source"
          );
          return false;
        }
        break;
      default:
        return false;
    }
  }
  return true;
}
