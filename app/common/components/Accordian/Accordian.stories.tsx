import React from "react";
import { Story, Meta } from "@storybook/react";

import { Button, IconEth, Stack } from "degen";
import Accordian, { AccordianProps } from ".";
// import * as DependentStories from './Dependent.stories'

export default {
  title: "Accordian",
  component: Accordian,
} as Meta;

const Template: Story<AccordianProps> = (args: AccordianProps) => (
  <Accordian {...args} />
);

export const Default = Template.bind({});
Default.args = {
  name: "Accordian Title",
  children: (
    <Stack>
      <Button
        prefix={<IconEth />}
        center
        width="full"
        variant="transparent"
        size="small"
      >
        Epoch1
      </Button>
      <Button
        prefix={<IconEth />}
        center
        width="full"
        variant="transparent"
        size="small"
      >
        Epoch2
      </Button>
    </Stack>
  ),
};
