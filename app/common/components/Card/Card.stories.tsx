import React from "react";
import { Story, Meta } from "@storybook/react";

import Card, { CardProps } from ".";
// import * as DependentStories from './Dependent.stories'

export default {
  title: "Card",
  component: Card,
  args: {
    title: "Card Title",
    href: "/",
    avatar:
      "https://ipfs.moralis.io:2053/ipfs/QmVYsa4KQyRwBSJxQCmD1rDjyqYd1HJKrDfqLk3KMKLEhn",
  },
} as Meta;

const Template: Story<CardProps> = (args) => <Card {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Card Title",
  href: "/",
  avatar:
    "https://ipfs.moralis.io:2053/ipfs/QmVYsa4KQyRwBSJxQCmD1rDjyqYd1HJKrDfqLk3KMKLEhn",
};
