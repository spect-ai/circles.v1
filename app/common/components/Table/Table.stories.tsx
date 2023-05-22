import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";

import Table, { TableProps } from ".";
// import * as DependentStories from './Dependent.stories'

export default {
  title: "Table",
  component: Table,
} as Meta;

const Template: Story<TableProps> = (args) => {
  const [checked, setChecked] = useState([true, true, false, false]);

  return (
    <Table
      {...args}
      onClick={(checked) => {
        setChecked(checked);
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  columns: ["Column 1", "Column 2", "Column 3"],
  rows: [
    ["Row 1", "Row 2", "Row 3"],
    ["Row 1", "Row 2", "Row 3"],
    ["Row 1", "Row 2", "Row 3"],
    ["Row 1", "Row 2", "Row 3"],
  ],
};
