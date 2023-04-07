import { render } from "test/utils";

import Modal from "src/components/components/Modal";

test("renders Modal component with title", () => {
  const { getByText } = render(<Modal title="Modal" />);
  const title = getByText(/Modal/);
  expect(title).toBeInTheDocument();
});
