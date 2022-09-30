import React from "react";
import { Story, Meta } from "@storybook/react";

import Breadcrumbs, { BreadcrumbsProps } from ".";
// import * as DependentStories from './Dependent.stories'

export default {
  title: "Breadcrumbs",
  component: Breadcrumbs,
} as Meta;

const Template: Story<BreadcrumbsProps> = (args) => <Breadcrumbs {...args} />;

export const Default = Template.bind({});
Default.args = {
  crumbs: [
    {
      name: "Home",
      href: "/",
      children: [
        { name: "Home", href: "/" },
        { name: "About", href: "/" },
        { name: "Trees", href: "/" },
        { name: "Circle dew", href: "/" },
        { name: "Anite", href: "/" },
      ],
    },
    { name: "Project", href: "/project" },
  ],
};
