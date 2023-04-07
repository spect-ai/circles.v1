import { render } from "test/utils";

import Breadcrumbs from "src/components/components/Breadcrumbs";

test("renders Breadcrumbs component with title", () => {
  const { getByText } = render(<Breadcrumbs title="Breadcrumbs" />);
  const title = getByText(/Breadcrumbs/);
  expect(title).toBeInTheDocument();
});
