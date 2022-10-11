import Dropdown, {
  OptionType as SingleSelectOptionType,
} from "@/app/common/components/Dropdown";
import { Box, IconPencil, Input, Stack, Text, Textarea, useTheme } from "degen";
import { ethers } from "ethers";
import React, { memo, useCallback, useState } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

type Props = {
  id: string;
  index: number;
  setIsEditFieldOpen: (value: boolean) => void;
  setPropertyName: (value: string) => void;
};

const Container = styled(Box)<{ isDragging: boolean; mode: string }>`
  border-color: ${(props) => props.isDragging && "rgb(191, 90, 242, 1)"};
  border: ${(props) =>
    props.isDragging
      ? "2px solid rgb(191, 90, 242, 1)"
      : "2px solid transparent"};

  transition: border-color 0.5s ease;

  &:hover {
    border-color: ${(props) =>
      props.mode === "dark" ? "rgb(255, 255, 255, 0.1)" : "rgb(20,20,20,0.1)"};
    border-width: 2px;
  }
`;

function FieldComponent({
  id,
  index,
  setIsEditFieldOpen,
  setPropertyName,
}: Props) {
  const { localCollection: collection } = useLocalCollection();
  const [hover, setHover] = useState(false);

  const { mode } = useTheme();

  const DraggableContent = (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => (
    <Container
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      padding="4"
      margin="1"
      borderRadius="large"
      isDragging={snapshot.isDragging}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      mode={mode}
    >
      <Stack direction="horizontal">
        <Text weight="semiBold">{collection.properties[id]?.name}</Text>
        {hover && (
          <Box
            cursor="pointer"
            backgroundColor="accentSecondary"
            borderRadius="large"
            paddingY="1"
            paddingX="2"
            onClick={() => {
              setPropertyName(collection.properties[id]?.name);
              setIsEditFieldOpen(true);
            }}
          >
            <Stack direction="horizontal" space="1" align="center">
              <IconPencil color="accent" size="4" />
              <Text color="accent">Edit</Text>
            </Stack>
          </Box>
        )}
      </Stack>
      {collection.properties[id]?.type === "shortText" && (
        <Input
          label=""
          placeholder={`Enter ${collection.properties[id]?.name}`}
          value={collection.data && collection.data[id]}
          // onChange={(e) => setLabel(e.target.value)}
        />
      )}
      {collection.properties[id]?.type === "ethAddress" && (
        <Input
          label=""
          placeholder={`Enter ${collection.properties[id]?.name}`}
          value={collection.data && collection.data[id]}
          // onChange={(e) => setLabel(e.target.value)}
          error={
            collection.data &&
            !ethers.utils.isAddress(collection.data && collection.data[id])
          }
        />
      )}
      {collection.properties[id]?.type === "longText" && (
        <Box marginTop="4">
          <Textarea
            label
            hideLabel
            maxLength={100}
            rows={3}
            placeholder={`Enter ${collection.properties[id]?.name}`}
            value={collection.data && collection.data[id]}
            onChange={(e) => {
              //  setBio(e.target.value);
            }}
          />
        </Box>
      )}
      {collection.properties[id]?.type === "singleSelect" && (
        <Box marginTop="4">
          <Dropdown
            placeholder={`Select ${collection.properties[id]?.name}`}
            multiple={false}
            options={
              collection.properties[id]?.options as SingleSelectOptionType[]
            }
            selected={collection.data && collection.data[id]}
            onChange={(value) => {
              // setselectedSafe(value);
              console.log({ value });
            }}
          />
        </Box>
      )}
      {collection.properties[id]?.type === "multiSelect" && (
        <Box marginTop="4">
          <Dropdown
            placeholder={`Select ${collection.properties[id]?.name}`}
            multiple={true}
            options={
              collection.properties[id]?.options as SingleSelectOptionType[]
            }
            selected={collection.data && collection.data[id]}
            onChange={(value) => {
              // setselectedSafe(value);
              console.log({ value });
            }}
          />
        </Box>
      )}
    </Container>
  );

  const DraggableContentCallback = useCallback(DraggableContent, [
    collection.data,
    collection.properties,
    hover,
    id,
    mode,
  ]);

  return (
    <Draggable draggableId={id} index={index}>
      {DraggableContentCallback}
    </Draggable>
  );
}

export default memo(FieldComponent);
