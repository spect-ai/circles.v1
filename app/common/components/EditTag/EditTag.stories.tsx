import React from "react";
import { Story, Meta } from "@storybook/react";

import EditTag, { EditTagProps } from ".";
import { Box, Heading } from "degen";
// import * as DependentStories from './Dependent.stories'

export default {
  title: "EditTag",
  component: EditTag,
} as Meta;

const Template: Story<EditTagProps> = (args) => <EditTag {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: "Tag",
  tone: "accent",
  label: "Edit",
  modalTitle: "Edit Tag",
  children: (
    <Box>
      <Heading>Modal Content</Heading>
    </Box>
  ),
};
