import { render } from "test/utils";

import Dropdown from "src/components/components/Dropdown";

test("renders Dropdown component with title", () => {
  const { getByText } = render(<Dropdown title="Dropdown" />);
  const title = getByText(/Dropdown/);
  expect(title).toBeInTheDocument();
});
