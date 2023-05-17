import Popover from "@/app/common/components/Popover";
import { smartTrim } from "@/app/common/utils/utils";
import { PropertyType } from "@/app/types";
import {
  Box,
  IconDotsHorizontal,
  IconPencil,
  Stack,
  Text,
  useTheme,
} from "degen";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { getPropertyIcon } from "../../CollectionProject/EditProperty/Utils";
import { useLocalCollection } from "../Context/LocalCollectionContext";

type Props = {
  propertyId: string;
  columnName: string;
  setPropertyId: (name: string) => void;
  setIsEditFieldOpen: (value: boolean) => void;
  propertyType: PropertyType;
};

type PopoverOptionProps = {
  onClick: (e?: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
  tourId?: string;
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

export default function HeaderComponent({
  propertyId,
  columnName,
  setIsEditFieldOpen,
  setPropertyId,
  propertyType,
}: Props) {
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
            <Stack direction="horizontal" align="center" space="2">
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
                        (propertyId === "Title" ||
                          propertyId === "Description" ||
                          propertyId === "__cardStatus__")
                      ) {
                        toast.warn("You can't edit this field");
                        return;
                      }
                      setIsEditFieldOpen(true);
                      setPropertyId(propertyId);
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
            setPropertyId(columnName);
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

        {/* <PopoverOption
          onClick={() => {
            sortData(columnName, true);
            setIsOpen(false);
          }}
        >
          <Stack direction="horizontal" space="2" align="center">
            <Text>▲</Text>
            <Text
              variant="small"
              weight="semiBold"
              ellipsis
              color="textSecondary"
            >
              Sort Ascending
            </Text>
          </Stack>
        </PopoverOption>
        <PopoverOption
          onClick={() => {
            sortData(columnName, false);
            setIsOpen(false);
          }}
        >
          <Stack direction="horizontal" space="2" align="center">
            <Text>▼</Text>
            <Text
              variant="small"
              weight="semiBold"
              ellipsis
              color="textSecondary"
            >
              Sort Descending
            </Text>
          </Stack>
        </PopoverOption> */}
      </ScrollContainer>
    </Popover>
  );
}

const PopoverOption = ({ children, onClick, tourId }: PopoverOptionProps) => {
  const { mode } = useTheme();

  return (
    <PopoverOptionContainer
      padding="4"
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
      borderRadius="large"
      data-tour={tourId}
      mode={mode}
    >
      <Text variant="small" weight="semiBold" ellipsis color="textSecondary">
        {children}
      </Text>
    </PopoverOptionContainer>
  );
};

const PopoverOptionContainer = styled(Box)<{ mode: string }>`
  &:hover {
    background-color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 20, 20, 0.1)"};
  }
`;
