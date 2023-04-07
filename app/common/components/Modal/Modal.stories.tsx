import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import { Box, Button } from "degen";
import { AnimatePresence } from "framer-motion";
import Modal, { ModalProps } from ".";

// import * as DependentStories from './Dependent.stories'

export default {
  title: "Modal",
  component: Modal,
  args: {
    title: "Modal Title",
    handleClose: () => {},
    size: "medium",
  },
} as Meta;

const Template: Story<ModalProps> = ({ handleClose, ...args }: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="small" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      <AnimatePresence>
        {isOpen && (
          <Modal {...args} handleClose={() => setIsOpen(false)}>
            <Box />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  //   ...DependentStories.Default.args,
  title: "Default Modal",
  size: "medium",
};

export const SmallModal = Template.bind({});
SmallModal.args = {
  //   ...DependentStories.Default.args,
  title: "Small Modal",
  size: "small",
};

export const LargeModal = Template.bind({});
LargeModal.args = {
  //   ...DependentStories.Default.args,
  title: "Large Modal",
  size: "large",
};
