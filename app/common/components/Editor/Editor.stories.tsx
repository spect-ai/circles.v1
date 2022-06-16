import React from "react";
import { Story, Meta } from "@storybook/react";

import Editor, { EditorProps } from ".";
// import * as DependentStories from './Dependent.stories'

export default {
  title: "Editor",
  component: Editor,
} as Meta;

const Template: Story<EditorProps> = (args) => <Editor {...args} />;

export const Default = Template.bind({});
Default.args = {};
