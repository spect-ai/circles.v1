import TableView from "../Project/TableView";
import { useLocalCollection } from "./Context/LocalCollectionContext";
import { Form } from "./Form";

export function Collection() {
  const { view } = useLocalCollection();
  return (
    <>
      {view === 0 && <Form />}
      {/* {view === 1 && <TableView viewId="" />} */}
    </>
  );
}
