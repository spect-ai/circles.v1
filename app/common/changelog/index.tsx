import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { Box } from "degen";
import Editor from "../components/Editor";

type Props = {
  handleClose: () => void;
  data: {
    Title: string;
    Description: string;
  };
};

const Changelog = ({ handleClose, data }: Props) => {
  return (
    <Modal title={data?.Title || "Changelog"} handleClose={handleClose}>
      <Box padding="8">
        {data?.Description && <Editor value={data?.Description} disabled />}
      </Box>
    </Modal>
  );
};

export default Changelog;
