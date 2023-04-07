import { render } from "test/utils";

import Tabs from "src/components/components/Tabs";

test("renders Tabs component with title", () => {
  const { getByText } = render(<Tabs title="Tabs" />);
  const title = getByText(/Tabs/);
  expect(title).toBeInTheDocument();
});
