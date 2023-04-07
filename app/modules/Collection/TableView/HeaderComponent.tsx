import Popover from "@/app/common/components/Popover";
import { smartTrim } from "@/app/common/utils/utils";
import { PropertyType } from "@/app/types";
import { Box, IconPencil, Stack, Text, useTheme } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import getPropertyIcon from "../../CollectionProject/EditProperty/Utils";

type Props = {
  columnName: string;
  setPropertyName: (name: string) => void;
  setIsEditFieldOpen: (value: boolean) => void;
  propertyType: PropertyType;
};

type PopoverOptionProps = {
  onClick: (e?: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
};

const PopoverOptionContainer = styled(Box)<{ mode: string }>`
  &:hover {
    background-color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 20, 20, 0.1)"};
  }
`;

const PopoverOption = ({ children, onClick }: PopoverOptionProps) => {
  const { mode } = useTheme();

  return (
    <PopoverOptionContainer
      padding="4"
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
      borderRadius="large"
      mode={mode}
    >
      <Text variant="small" weight="semiBold" ellipsis color="textSecondary">
        {children}
      </Text>
    </PopoverOptionContainer>
  );
};

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: auto;
  width: 30rem;
`;

const HeaderComponent = ({
  columnName,
  setIsEditFieldOpen,
  setPropertyName,
  propertyType,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const { localCollection: collection } = useLocalCollection();
  return (
    <Popover
      butttonComponent={
        <Box
          onMouseEnter={() => setShowEdit(true)}
          onMouseLeave={() => setShowEdit(false)}
        >
          <Stack direction="horizontal" justify="space-between">
            <Stack direction="horizontal" space="2">
              <Text variant="label">{getPropertyIcon(propertyType)}</Text>
              <Text variant="label">{smartTrim(columnName, 17)}</Text>
            </Stack>
            <AnimatePresence>
              {showEdit && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ position: "absolute", right: 2 }}
                >
                  <Box
                    cursor="pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (
                        collection.collectionType === 1 &&
                        (columnName === "Title" ||
                          columnName === "Description" ||
                          columnName === "__cardStatus__")
                      ) {
                        toast.warn("You can't edit this field");
                        return;
                      }
                      setIsEditFieldOpen(true);
                      setPropertyName(columnName);
                    }}
                  >
                    <Text color="accent">
                      <IconPencil size="5" />
                    </Text>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Stack>
        </Box>
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <ScrollContainer
        backgroundColor="background"
        borderWidth="0.5"
        borderRadius="large"
      >
        <PopoverOption
          onClick={() => {
            setIsOpen(false);
            setIsEditFieldOpen(true);
            setPropertyName(columnName);
          }}
        >
          <Stack direction="horizontal" space="2" align="center">
            <IconPencil />
            <Text
              variant="small"
              weight="semiBold"
              ellipsis
              color="textSecondary"
            >
              Customize Field
            </Text>
          </Stack>
        </PopoverOption>
      </ScrollContainer>
    </Popover>
  );
};

export default HeaderComponent;
