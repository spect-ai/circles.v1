---
to: "<%= location ? `app/common/${location}` : 'src/components' %>/<%= h.path.parse(h.inflection.camelize(name, false)).base %>/index.tsx"
---
<% formattedPath = h.inflection.camelize(name, true).replace(/::/g, '/') -%>
<% component = h.path.parse(h.inflection.camelize(name, false)).base -%>
import type { FC } from 'react'

import { Box, Text } from "degen";

interface Props {
  title: string
}

const <%= component %>: FC<Props> = ({ title }) => {

  return (
    <Box>
        <Text>This component was generated by Hygen</Text>
    </Box>
  )
}

export default <%= component %>

export type { Props as <%= component %>Props }
