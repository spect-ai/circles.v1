import React from "react";
import { Story, Meta } from "@storybook/react";

import Popover, { PopoverProps } from ".";
import { Box, IconDotsHorizontal, Stack, Text } from "degen";
import styled from "styled-components";
// import * as DependentStories from './Dependent.stories'

export default {
  title: "Popover",
  component: Popover,
} as Meta;

const Template: Story<PopoverProps> = (args) => <Popover {...args} />;

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: 14rem;
  overflow-y: auto;
`;

export const Default = Template.bind({});
Default.args = {
  butttonComponent: (
    <Stack direction="horizontal" align="center" justify="center">
      <IconDotsHorizontal />
      <Text>More</Text>
    </Stack>
  ),
  isOpen: true,
  setIsOpen: () => {},
  children: (
    <ScrollContainer
      backgroundColor="backgroundSecondary"
      borderWidth="0.5"
      borderRadius="3xLarge"
      padding="2"
    >
      <Stack>
        <Box borderBottomWidth="0.375" padding="2" overflow="hidden">
          <Text size="large" weight="semiBold" ellipsis>
            Option 1
          </Text>
        </Box>
        <Box borderBottomWidth="0.375" padding="2" overflow="hidden">
          <Text size="large" weight="semiBold" ellipsis>
            Option 2
          </Text>
        </Box>
        <Box borderBottomWidth="0.375" padding="2" overflow="hidden">
          <Text size="large" weight="semiBold" ellipsis>
            Option 3
          </Text>
        </Box>
        <Box borderBottomWidth="0.375" padding="2" overflow="hidden">
          <Text size="large" weight="semiBold" ellipsis>
            Option 4
          </Text>
        </Box>
        <Box borderBottomWidth="0.375" padding="2" overflow="hidden">
          <Text size="large" weight="semiBold">
            Option 5
          </Text>
        </Box>
      </Stack>
    </ScrollContainer>
  ),
};
