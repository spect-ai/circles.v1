import { Box, useTheme } from "degen";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import CollectionProject from "../CollectionProject";
import CollectionHeading from "./CollectionHeading";
import { useLocalCollection } from "./Context/LocalCollectionContext";
import { Form } from "./Form";
import TableView from "./TableView";

export function Collection() {
  const { view, setView, localCollection: collection } = useLocalCollection();
  const { mode } = useTheme();

  useEffect(() => {
    setView(0);
  }, [setView]);

  return (
    <>
      <ToastContainer
        toastStyle={{
          backgroundColor: `${
            mode === "dark" ? "rgb(20,20,20)" : "rgb(240,240,240)"
          }`,
          color: `${
            mode === "dark" ? "rgb(255,255,255,0.7)" : "rgb(20,20,20,0.7)"
          }`,
        }}
      />
      {collection.collectionType === 0 && (
        <Box>
          <CollectionHeading />
          {view === 0 && <Form />}
          {view === 1 && <TableView />}
        </Box>
      )}
      {collection.collectionType === 1 && <CollectionProject />}
    </>
  );
}
