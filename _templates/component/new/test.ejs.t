---
to: "<%= location ? `app/common/${location}` : 'src/components' %>/<%= h.path.parse(h.inflection.camelize(name, false)).base %>/<%= h.path.parse(h.inflection.camelize(name, false)).base %>.test.tsx"
---
<% component = h.path.parse(h.inflection.camelize(name, false)).base -%>
<% formattedPath = location ? `${location}/${component}` : component -%>
import { render } from 'test/utils'

import <%= component %> from 'src/components/<%= formattedPath %>'

test('renders <%= component %> component with title', () => {
  const { getByText } = render(<<%= component %> title="<%= component %>" />)
  const title = getByText(/<%= component %>/)
  expect(title).toBeInTheDocument()
})
