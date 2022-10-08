import { useLocalCollection } from "./Context/LocalCollectionContext";
import { Form } from "./Form";
import TableView from "./TableView";

export function Collection() {
  const { view } = useLocalCollection();
  return (
    <>
      {view === 0 && <Form />}
      {view === 1 && <TableView />}
    </>
  );
}
