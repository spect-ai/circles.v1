import { Box } from "degen";
import { useState } from "react";

import { SkeletonLoader } from "../../Explore/SkeletonLoader";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import FormEditor from "./FormEditor";
import EditorHeader from "./FormEditor/EditorHeader";
import FormDesigner from "./FormDesigner";
import ViewPlugins from "../../Plugins/ViewPlugins";
import FormSettings from "./FormSettings";

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
      {viewPage === "design" && <FormDesigner />}
      {viewPage === "plugins" && <ViewPlugins />}
      {viewPage === "settings" && <FormSettings />}
    </Box>
  );
}
