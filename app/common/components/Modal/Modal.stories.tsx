import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import Modal, { ModalProps } from ".";
import { Box, Button } from "degen";

// import * as DependentStories from './Dependent.stories'

export default {
  title: "Modal",
  component: Modal,
  args: {
    title: "Modal Title",
    handleClose: () => {},
  },
} as Meta;

const Template: Story<ModalProps> = ({ handleClose, ...args }: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="small" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      {isOpen && (
        <Modal {...args} handleClose={() => setIsOpen(false)}>
          <Box />
        </Modal>
      )}
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  //   ...DependentStories.Default.args,
};

export const SmallModal = Template.bind({});
SmallModal.args = {
  //   ...DependentStories.Default.args,
  modalWidth: "30rem",
  modalHeight: "30rem",
  title: "Small Modal",
};
