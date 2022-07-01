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
    { name: "Home", href: "/" },
    { name: "Project", href: "/project" },
  ],
};
