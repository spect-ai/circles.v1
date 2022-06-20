import React from 'react'
import { Story, Meta } from '@storybook/react'

import PriorityIcon from '.'
// import * as DependentStories from './Dependent.stories'

export default {
  title: 'PriorityIcon',
  component: PriorityIcon,
} as Meta

const Template: Story = (args) => <PriorityIcon title="PriorityIcon Story" {...args} />

export const Default = Template.bind({})
Default.args = {
  //   ...DependentStories.Default.args,
}

export const Preview = Template.bind({})
Preview.args = {
  //   ...DependentStories.Default.args,
  preview: true,
}
