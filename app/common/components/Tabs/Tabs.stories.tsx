import React from "react";
import { Story, Meta, storiesOf } from "@storybook/react";
import useState from "storybook-addon-state";

import Tabs, { TabsProps } from ".";
import { useArgs } from "@storybook/addons";
// import * as DependentStories from './Dependent.stories'

export default {
  title: "Tabs",
  component: Tabs,
} as Meta;

const Template: Story<TabsProps> = ({ onTabClick, ...args }: TabsProps) => {
  const [_, updateArgs] = useArgs();
  return (
    <Tabs
      {...args}
      onTabClick={(index: number) => {
        updateArgs({ selectedTab: index });
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};

export const Vertical = Template.bind({});
Vertical.args = {
  orientation: "vertical",
};

export const WithCustomColor = Template.bind({});
WithCustomColor.args = {
  unselectedColor: "tertiary",
};
