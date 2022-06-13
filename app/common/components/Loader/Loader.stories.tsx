import React from "react";
import { Story, Meta } from "@storybook/react";

import Loader, { LoaderProps } from ".";
// import * as DependentStories from './Dependent.stories'

export default {
  title: "Loader",
  component: Loader,
  args: {
    loading: true,
    text: "Loading...",
  },
} as Meta;

const Template: Story<LoaderProps> = (args) => <Loader {...args} />;

export const Default = Template.bind({});
Default.args = {
  //   ...DependentStories.Default.args,
  loading: true,
};
