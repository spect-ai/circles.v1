import React from 'react'
import { Story, Meta } from '@storybook/react'

import ModalOption from '.'
// import * as DependentStories from './Dependent.stories'

export default {
  title: 'ModalOption',
  component: ModalOption,
} as Meta

const Template: Story = (args) => <ModalOption title="ModalOption Story" {...args} />

export const Default = Template.bind({})
Default.args = {
  //   ...DependentStories.Default.args,
}

export const Preview = Template.bind({})
Preview.args = {
  //   ...DependentStories.Default.args,
  preview: true,
}
