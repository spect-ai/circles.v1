import React from "react";
import { Story, Meta, storiesOf } from "@storybook/react";
import useState from "storybook-addon-state";

import Tabs, { TabsProps } from ".";
import { useArgs } from "@storybook/addons";
// import * as DependentStories from './Dependent.stories'

export default {
  title: "Tabs",
  component: Tabs,
  args: {
    selectedTab: 0,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onTabClick: (index: number) => {},
    tabs: ["Tab 1", "Tab 2", "Tab 3"],
    orientation: "horizontal",
    unselectedColor: "transparent",
  },
} as Meta;

// storiesOf("Tabs", module).add("default", () => {
//   const [tab, setTab] = useState("tab", 0);

//   return (
//     <Tabs
//       selectedTab={tab}
//       tabs={["Tab 1", "Tab 2", "Tab 3"]}
//       orientatation="horizontal"
//       onTabClick={(tab: number) => setTab(tab)}
//       unselectedColor="transparent"
//     />
//   );
// });

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
