import { useOutsideAlerter } from "@/app/common/components/Popover";
import { Portal } from "@/app/common/components/Portal/portal";
import { PropertyType } from "@/app/types";
import { Box } from "degen";
import React, { useRef, useState } from "react";
import { CellProps } from "react-datasheet-grid";
import { usePopper } from "react-popper";
import styled from "styled-components";
import SelectComponent from "../../TableView/SelectComponent";

const getComponent = (type: PropertyType) => {
  switch (type) {
    case "singleSelect":
      return SelectComponent;
    case "multiSelect":
      return SelectComponent;
    default:
      return null;
  }
};

export default function ExandableCell({
  focus,
  active,
  rowData,
  columnData,
  setRowData,
  stopEditing,
}: CellProps) {
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

  useOutsideAlerter(wrapperRef, setIsOpen);

  if (!Component) {
    return null;
  }
  if (isOpen) {
    return (
      <Box ref={setReferenceElement}>
        <Portal>
          <Container
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
              <Component
                focus={focus}
                active={active}
                rowData={rowData}
                columnData={columnData}
                isModalOpen={true}
                setRowData={setRowData}
                stopEditing={stopEditing}
              />
            </div>
          </Container>
        </Portal>
      </Box>
    );
  }

  return (
    <Box onClick={() => setIsOpen(!isOpen)} width="full" overflow="hidden">
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
}

const Container = styled(Box)`
  height: 7rem;
  width: 24rem;
  background: rgba(20, 20, 20);
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 1rem rgba(0, 0, 0, 1);
`;
