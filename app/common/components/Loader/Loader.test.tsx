import { render } from 'test/utils'

import Loader from 'src/components/components/Loader'

test('renders Loader component with title', () => {
  const { getByText } = render(<Loader title="Loader" />)
  const title = getByText(/Loader/)
  expect(title).toBeInTheDocument()
})
