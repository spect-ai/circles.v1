import React from "react";
import { Story, Meta } from "@storybook/react";

import ModalOption, { ModalOptionProps } from ".";
// import * as DependentStories from './Dependent.stories'

export default {
  title: "ModalOption",
  component: ModalOption,
} as Meta;

const Template: Story<ModalOptionProps> = (args) => <ModalOption {...args} />;

export const Default = Template.bind({});
Default.args = {
  //   ...DependentStories.Default.args,
};
