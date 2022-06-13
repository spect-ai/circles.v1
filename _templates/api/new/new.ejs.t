---
to: "<%= location ? `pages/api/${location}` : 'pages/api' %>/<%= name %>.ts"
---
<% route = h.path.parse(h.inflection.camelize(name, false)).base -%>
import type { NextApiRequest, NextApiResponse } from 'next'

type <%= route %>Data = {
  name: string
}

export default async (req: NextApiRequest, res: NextApiResponse<<%= route %>Data>) => {
  res.statusCode = 200
  res.json({ name: 'John Doe' })
}
