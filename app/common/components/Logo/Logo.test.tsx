import { render } from 'test/utils'

import Logo from 'src/components/components/Logo'

test('renders Logo component with title', () => {
  const { getByText } = render(<Logo title="Logo" />)
  const title = getByText(/Logo/)
  expect(title).toBeInTheDocument()
})
