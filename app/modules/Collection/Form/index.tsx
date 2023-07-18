import { Box } from "degen";
import { useState } from "react";
import FormEditor from "./FormEditor";
import EditorHeader from "./FormEditor/EditorHeader";
import FormDesigner from "./FormDesigner";
import ViewPlugins from "../../Plugins/ViewPlugins";
import FormSettings from "./FormSettings";
import FormShare from "./FormShare";

export function Form() {
  const [viewPage, setViewPage] = useState("editor");
  return (
    <Box>
      <EditorHeader setViewPage={setViewPage} viewPage={viewPage} />
      {viewPage === "editor" && <FormEditor />}
      {viewPage === "design" && <FormDesigner />}
      {viewPage === "share" && <FormShare />}
      {viewPage === "plugins" && <ViewPlugins />}
      {viewPage === "settings" && <FormSettings />}
    </Box>
  );
}
