import {
  RedditNodeData,
  redditNodeDataSchema,
} from "@avp1598/spect-shared-types";
import NodeFactory from "../../../Common/NodeFactory";
import { toast } from "react-toastify";
import { isURL } from "@/app/common/utils/utils";

const Reddit = new NodeFactory<RedditNodeData>({
  label: "Reddit",
  description: "Posts from your subreddit",
  type: "reddit",
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
      name: "Posts Output",
    },
  ],
  validateNode: (data) => {
    data = redditNodeDataSchema.parse(data);
    if (!data.url || !isURL(data.url) || !data.url.includes("reddit.com")) {
      toast.error("Please enter a valid Reddit URL on the Reddit node");
      return false;
    }
    if (!data.filter || !data.filter.length) {
      toast.error("Reddit node is missing flair filter, please add that");
      return false;
    }
    return true;
  },
  fields: [
    {
      label: "Subreddit URL",
      value: "url",
      type: "url",
      description: "Please enter the url of your subreddit",
      placeholder: "https://www.reddit.com/r/ourguild/",
    },
    {
      label: "Flair filter",
      value: "filter",
      type: "text",
      description: "The flair to filter the posts by",
      placeholder: "Guild.Log",
    },
  ],
});

export default Reddit;
