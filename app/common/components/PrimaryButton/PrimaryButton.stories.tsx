import React from "react";
import { Story, Meta } from "@storybook/react";

import PrimaryButton from ".";
// import * as DependentStories from './Dependent.stories'

export default {
  title: "PrimaryButton",
  component: PrimaryButton,
} as Meta;

const Template: Story = (args) => <PrimaryButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  //   ...DependentStories.Default.args,
};

export const Preview = Template.bind({});
Preview.args = {
  //   ...DependentStories.Default.args,
  preview: true,
};
