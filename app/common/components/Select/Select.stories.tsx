import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";

import Select, { SelectProps } from ".";
// import * as DependentStories from './Dependent.stories'

export default {
  title: "Select",
  component: Select,
} as Meta;

const Template: Story<SelectProps> = (args) => {
  const [value, setValue] = useState({ label: "Option 1", value: "option-1" });
  return <Select {...args} value={value} onChange={(val) => setValue(val)} />;
};

export const Default = Template.bind({});
Default.args = {
  options: [
    { label: "Option 1", value: "option-1" },
    { label: "Option 2", value: "option-2" },
    { label: "Option 3", value: "option-3" },
  ],
  value: { label: "Option 1", value: "option-1" },
  onChange: (value) => console.log(value),
};
