import { render } from "test/utils";

import Editor from "src/components/components/Editor";

test("renders Editor component with title", () => {
  const { getByText } = render(<Editor title="Editor" />);
  const title = getByText(/Editor/);
  expect(title).toBeInTheDocument();
});
