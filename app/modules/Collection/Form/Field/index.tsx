import Dropdown, {
  OptionType as SingleSelectOptionType,
} from "@/app/common/components/Dropdown";
import MultiSelectDropdown, {
  OptionType as MultiSelectOptionType,
} from "@/app/common/components/MultiSelectDropDown/MultiSelectDropDown";
import { PriorityIcon } from "@/app/common/components/PriorityIcon";
import { monthMap } from "@/app/common/utils/constants";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { CardType, MemberDetails } from "@/app/types";
import {
  Avatar,
  AvatarGroup,
  Box,
  IconEth,
  Input,
  Stack,
  Tag,
  Text,
  Textarea,
  useTheme,
} from "degen";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

type Props = {
  id: string;
  index: number;
};

const Container = styled(Box)<{ isDragging: boolean; mode: string }>`
  border-color: ${(props) => props.isDragging && "rgb(191, 90, 242, 1)"};
  border-width: ${(props) => props.isDragging && "2px"};
  &:hover {
    border-color: ${(props) =>
      props.mode === "dark" ? "rgb(255, 255, 255, 0.1)" : "rgb(20,20,20,0.1)"};
    border-width: 2px;
  }
`;

function FieldComponent({ id, index }: Props) {
  const router = useRouter();
  const { localCollection: collection, setLocalCollection } =
    useLocalCollection();
  const [hover, setHover] = useState(false);
  const [isBioDirty, setIsBioDirty] = useState(false);

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
      <Box>
        <Box marginTop="1" marginBottom="4">
          <Text weight="semiBold">{collection.properties[id]?.name}</Text>
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
                  setIsBioDirty(true);
                }}
              />
            </Box>
          )}
          {collection.properties[id]?.type === "singleSelect" && (
            <Box marginTop="4">
              <Dropdown
                options={
                  collection.properties[id]?.options as SingleSelectOptionType[]
                }
                selected={collection.data && collection.data[id]}
                onChange={(value) => {
                  // setselectedSafe(value);
                }}
              />
            </Box>
          )}
          {collection.properties[id]?.type === "multiSelect" && (
            <Box marginTop="4">
              <MultiSelectDropdown
                options={
                  collection.properties[id]?.options?.map(
                    (a: { value: any; label: any }) => {
                      return {
                        id: a.value,
                        name: a.label,
                      };
                    }
                  ) as MultiSelectOptionType[]
                }
                value={collection.data && collection.data[id]}
                setValue={() => {}}
                width={""}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DraggableContentCallback = useCallback(DraggableContent, [mode]);

  return (
    <Draggable draggableId={id} index={index}>
      {DraggableContentCallback}
    </Draggable>
  );
}

export default memo(FieldComponent);
