import {
  Avatar,
  Box,
  Button,
  IconSearch,
  Input,
  Stack,
  Tag,
  Text,
} from "degen";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import Modal from "../Modal";

type Props = {
  name: string;
  modalTitle: string;
  children: React.ReactNode;
  tone?: string;
  tagLabel?: string;
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
};

function EditTag({
  name,
  tone = "accent",
  tagLabel,
  modalTitle,
  children,
  modalOpen,
  setModalOpen,
}: Props) {
  return (
    <>
      <motion.button
        whileHover={{
          scale: 1.03,
        }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setModalOpen(true)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "0rem",
        }}
      >
        {!tagLabel ? (
          <Tag tone={tone as any}>
            <Box paddingX="2">
              <Text>{name}</Text>
            </Box>
          </Tag>
        ) : (
          <Tag tone={tone as any} label={tagLabel} hover>
            <Box paddingX="2">
              <Text>{name}</Text>
            </Box>
          </Tag>
        )}
      </motion.button>
      <AnimatePresence
        initial={false}
        exitBeforeEnter
        onExitComplete={() => null}
      >
        {modalOpen && (
          <Modal handleClose={() => setModalOpen(false)} title={modalTitle}>
            {children}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default EditTag;

export type { Props as EditTagProps };
