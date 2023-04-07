import { render } from "test/utils";

import PriorityIcon from "src/components/components/PriorityIcon";

test("renders PriorityIcon component with title", () => {
  const { getByText } = render(<PriorityIcon title="PriorityIcon" />);
  const title = getByText(/PriorityIcon/);
  expect(title).toBeInTheDocument();
});
