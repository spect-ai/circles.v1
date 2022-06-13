import React from "react";
import { Story, Meta } from "@storybook/react";

import Logo from ".";
// import * as DependentStories from './Dependent.stories'

export default {
  title: "Logo",
  component: Logo,
} as Meta;

const Template: Story = (args) => (
  <Logo
    href="/"
    src="https://ipfs.moralis.io:2053/ipfs/QmVYsa4KQyRwBSJxQCmD1rDjyqYd1HJKrDfqLk3KMKLEhn"
    {...args}
  />
);

export const Default = Template.bind({});
Default.args = {
  //   ...DependentStories.Default.args,
  href: "/",
  src: "https://ipfs.moralis.io:2053/ipfs/QmVYsa4KQyRwBSJxQCmD1rDjyqYd1HJKrDfqLk3KMKLEhn",
};
