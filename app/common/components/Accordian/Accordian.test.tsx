import { render } from "test/utils";

import Accordian from "src/components/components/Accordian";

test("renders Accordian component with title", () => {
  const { getByText } = render(<Accordian title="Accordian" />);
  const title = getByText(/Accordian/);
  expect(title).toBeInTheDocument();
});
