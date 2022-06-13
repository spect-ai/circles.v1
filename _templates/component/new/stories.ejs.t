---
to: "<%= location ? `app/common/${location}` : 'src/components' %>/<%= h.path.parse(h.inflection.camelize(name, false)).base %>/<%= h.path.parse(h.inflection.camelize(name, false)).base %>.stories.tsx"
---
<% formattedPath = location ? `${location}/${h.path.parse(h.inflection.camelize(name, false)).base}` : h.path.parse(h.inflection.camelize(name, false)).base -%>
<% component = h.path.parse(h.inflection.camelize(name, false)).base -%>
import React from 'react'
import { Story, Meta } from '@storybook/react'

import <%= component %> from '.'
// import * as DependentStories from './Dependent.stories'

export default {
  title: '<%= component %>',
  component: <%= component %>,
} as Meta

const Template: Story = (args) => <<%= component %> title="<%= component %> Story" {...args} />

export const Default = Template.bind({})
Default.args = {
  //   ...DependentStories.Default.args,
}

export const Preview = Template.bind({})
Preview.args = {
  //   ...DependentStories.Default.args,
  preview: true,
}
