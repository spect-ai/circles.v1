import { render } from "test/utils";

import Popover from "src/components/components/Popover";

test("renders Popover component with title", () => {
  const { getByText } = render(<Popover title="Popover" />);
  const title = getByText(/Popover/);
  expect(title).toBeInTheDocument();
});
