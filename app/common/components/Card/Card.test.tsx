import { render } from "test/utils";

import Card from "src/components/components/Card";

test("renders Card component with title", () => {
  const { getByText } = render(<Card title="Card" />);
  const title = getByText(/Card/);
  expect(title).toBeInTheDocument();
});
