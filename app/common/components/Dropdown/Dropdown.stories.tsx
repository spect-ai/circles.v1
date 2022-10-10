import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";

import Dropdown, { DropdownProps } from ".";
import { Box } from "degen";
// import * as DependentStories from './Dependent.stories'

export default {
  component: Dropdown,
} as Meta;

const Template: Story<DropdownProps> = (args) => {
  const [selected, setSelected] = useState({ value: "", label: "" });

  return (
    <Box width="full">
      <Dropdown
        {...args}
        onChange={(option) => {
          console.log({ option });
          setSelected(option);
        }}
        selected={selected}
        multiple={false}
      />
    </Box>
  );
};

export const Default = Template.bind({});
Default.args = {
  //   ...DependentStories.Default.args,
  options: [
    { label: "Option 1", value: "option-1" },
    { label: "Option 2", value: "option-2" },
    { label: "Option 3", value: "option-3" },
    { label: "Option 4", value: "option-4" },
    { label: "Option 5", value: "option-5" },
  ],
};
