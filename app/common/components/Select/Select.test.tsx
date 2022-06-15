import { render } from 'test/utils'

import Select from 'src/components/components/Select'

test('renders Select component with title', () => {
  const { getByText } = render(<Select title="Select" />)
  const title = getByText(/Select/)
  expect(title).toBeInTheDocument()
})
