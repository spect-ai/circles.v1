import React from "react";
import Modal from "../components/Modal";
import { Box } from "degen";
import Editor from "../components/Editor";
import { changelog, current_release } from "./content";

type Props = {
  handleClose: () => void;
};

const Changelog = ({ handleClose }: Props) => {
  return (
    <Modal
      title={`Release ${current_release} changelog`}
      handleClose={handleClose}
    >
      <Box padding="8">
        <Editor
          value={changelog[current_release]}
          // onSave={(val) => {
          //   console.log(val);
          // }}
          disabled
        />
      </Box>
    </Modal>
  );
};

export default Changelog;
