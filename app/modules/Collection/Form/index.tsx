import { Box } from "degen";
import { useState } from "react";

import { SkeletonLoader } from "../../Explore/SkeletonLoader";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import FormBuilder from "./FormBuilder";
import FormEditor from "./FormEditor";
import EditorHeader from "./FormEditor/EditorHeader";
import FormDesigner from "./FormDesigner";

export function Form() {
  const { loading } = useLocalCollection();

  const [viewPage, setViewPage] = useState("editor");

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <Box>
      <EditorHeader setViewPage={setViewPage} viewPage={viewPage} />
      {viewPage === "editor" && <FormEditor />}
      {viewPage === "preview" && <FormBuilder />}
      {viewPage === "design" && <FormDesigner />}
    </Box>
  );
}
