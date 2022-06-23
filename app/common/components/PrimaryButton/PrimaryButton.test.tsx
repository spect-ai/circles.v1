import { render } from 'test/utils'

import PrimaryButton from 'src/components/components/PrimaryButton'

test('renders PrimaryButton component with title', () => {
  const { getByText } = render(<PrimaryButton title="PrimaryButton" />)
  const title = getByText(/PrimaryButton/)
  expect(title).toBeInTheDocument()
})
