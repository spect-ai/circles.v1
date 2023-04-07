/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropertyType } from "@/app/types";
import { Box, IconClose, Stack, Text } from "degen";
import { useRef, useState } from "react";
import { CellProps } from "react-datasheet-grid";
import { usePopper } from "react-popper";
import styled from "styled-components";
import Portal from "@/app/common/components/Portal/portal";
import LongTextComponent from "../../TableView/LongTextComponent";
import SelectComponent from "../../TableView/SelectComponent";

const getComponent = (type: PropertyType) => {
  switch (type) {
    case "longText":
      return LongTextComponent;
    case "multiSelect":
      return SelectComponent;
    case "user[]":
      return SelectComponent;
    default:
      return null;
  }
};

const Container = styled(Box)`
  height: 7rem;
  width: 24rem;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.5);
  overflow-y: auto;
`;

const ExpandableCell = ({
  focus,
  active,
  rowData,
  columnData,
  setRowData,
  stopEditing,
}: CellProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [referenceElement, setReferenceElement] = useState<any>();
  const [popperElement, setPopperElement] = useState<any>();

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, -20],
        },
      },
      {
        name: "preventOverflow",
        options: {
          padding: 0,
          altBoundary: true,
          tether: false,
          rootBoundary: "viewport",
          altAxis: true,
          boundary: "clippingParents",
        },
      },
      {
        name: "flip",
        options: {
          fallbackPlacements: ["top-start"],
          padding: 0,
          altBoundary: true,
          rootBoundary: "viewport",
          altAxis: true,
          boundary: "clippingParents",
        },
      },
    ],
  });
  const wrapperRef = useRef(null);

  const Component = getComponent(columnData.type);

  // useOutsideAlerter(wrapperRef, setIsOpen);

  if (!Component) {
    return null;
  }
  if (isOpen) {
    return (
      <Box ref={setReferenceElement}>
        <Portal>
          <Container
            backgroundColor="background"
            position="absolute"
            zIndex="100"
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            <div
              ref={wrapperRef}
              style={{
                height: "100%",
                width: "100%",
              }}
            >
              <Box marginTop="-2">
                <Stack direction="horizontal" justify="space-between">
                  <Box />
                  <Box cursor="pointer" onClick={() => setIsOpen(!isOpen)}>
                    <IconClose color="accent" size="5" />
                  </Box>
                </Stack>
              </Box>
              <Component
                focus={focus}
                active={active}
                rowData={rowData}
                columnData={columnData}
                isModalOpen
                setRowData={setRowData}
                stopEditing={stopEditing}
              />
              <Box marginBottom="4" padding="2">
                <Stack direction="horizontal" justify="space-between">
                  <Box cursor="pointer" onClick={() => setIsOpen(!isOpen)}>
                    <Text color="accent">Close</Text>
                  </Box>
                  <Box />
                </Stack>
              </Box>
            </div>
          </Container>
        </Portal>
      </Box>
    );
  }

  return (
    <Box
      onClick={() => {
        focus && setIsOpen(true);
      }}
      width="full"
      height="8"
      overflow="hidden"
    >
      <Component
        focus={focus}
        active={active}
        rowData={rowData}
        columnData={columnData}
        setRowData={setRowData}
        stopEditing={stopEditing}
      />
    </Box>
  );
};

export default ExpandableCell;
