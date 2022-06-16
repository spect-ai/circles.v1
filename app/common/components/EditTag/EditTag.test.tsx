import { render } from 'test/utils'

import EditTag from 'src/components/components/EditTag'

test('renders EditTag component with title', () => {
  const { getByText } = render(<EditTag title="EditTag" />)
  const title = getByText(/EditTag/)
  expect(title).toBeInTheDocument()
})
