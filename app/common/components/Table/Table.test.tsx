import { render } from 'test/utils'

import Table from 'src/components/components/Table'

test('renders Table component with title', () => {
  const { getByText } = render(<Table title="Table" />)
  const title = getByText(/Table/)
  expect(title).toBeInTheDocument()
})
