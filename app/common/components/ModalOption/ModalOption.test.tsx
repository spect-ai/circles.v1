import { render } from 'test/utils'

import ModalOption from 'src/components/components/ModalOption'

test('renders ModalOption component with title', () => {
  const { getByText } = render(<ModalOption title="ModalOption" />)
  const title = getByText(/ModalOption/)
  expect(title).toBeInTheDocument()
})
