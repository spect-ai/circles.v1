/* eslint-disable @typescript-eslint/no-explicit-any */
import Dropdown from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import RewardField from "@/app/modules/PublicForm/RewardField";
import { MemberDetails, Registry, UserType } from "@/app/types";
import {
  Box,
  IconPencil,
  IconPlusSmall,
  Input,
  Stack,
  Tag,
  Text,
  useTheme,
} from "degen";
import { useRouter } from "next/router";
import React, { memo, useCallback, useState } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import mixpanel from "@/app/common/utils/mixpanel";
import Editor from "@/app/common/components/Editor";

type Props = {
  id: string;
  index: number;
  setIsEditFieldOpen: (value: boolean) => void;
  setPropertyName: (value: string) => void;
};

function FieldComponent({
  id,
  index,
  setIsEditFieldOpen,
  setPropertyName,
}: Props) {
  const { localCollection: collection } = useLocalCollection();
  const [hover, setHover] = useState(false);
  const { mode } = useTheme();
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const memberOptions = memberDetails?.members?.map((member: string) => ({
    label: memberDetails && memberDetails.memberDetails[member]?.username,
    value: member,
  }));

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
        <Box width="full" display="flex" flexDirection="row" gap="2">
          <Text weight="semiBold">{collection.properties[id]?.name}</Text>
          {collection.properties[id].required && (
            <Tag size="small" tone="accent">
              Required
            </Tag>
          )}
        </Box>
        <Box
          cursor="pointer"
          backgroundColor="accentSecondary"
          borderRadius="full"
          paddingY="1"
          paddingX="2"
          onClick={() => {
            setPropertyName(collection.properties[id]?.name);
            setIsEditFieldOpen(true);
            process.env.NODE_ENV === "production" &&
              mixpanel.track("Edit Field Button", {
                user: currentUser?.username,
                field: collection.properties[id]?.name,
              });
          }}
        >
          <IconPencil color="accent" size="4" />
        </Box>
      </Stack>
      {collection.properties[id]?.type === "shortText" && (
        <Input
          label=""
          placeholder={`Enter ${collection.properties[id]?.name}`}
          value={collection.data && collection.data[id]}
          // onChange={(e) => setLabel(e.target.value)}
        />
      )}
      {collection.properties[id]?.type === "email" && (
        <Input
          label=""
          placeholder={`Enter ${collection.properties[id]?.name}`}
          value={collection.data && collection.data[id]}
          inputMode="email"
          // onChange={(e) => setLabel(e.target.value)}
        />
      )}
      {collection.properties[id]?.type === "singleURL" && (
        <Input
          label=""
          placeholder={`Enter ${collection.properties[id]?.name}`}
          value={collection.data && collection.data[id]}
          inputMode="text"
          // onChange={(e) => setLabel(e.target.value)}
        />
      )}
      {collection.properties[id]?.type === "payWall" && (
        <PrimaryButton>Pay</PrimaryButton>
      )}
      {collection.properties[id]?.type === "multiURL" && (
        <Input
          label=""
          placeholder={`Enter ${collection.properties[id]?.name}`}
          value={collection.data && collection.data[id]?.[0]}
          inputMode="text"
          // onChange={(e) => setLabel(e.target.value)}
        />
      )}
      {collection.properties[id]?.type === "number" && (
        <Input
          label=""
          placeholder={`Enter ${collection.properties[id]?.name}`}
          value={collection.data && collection.data[id]}
          // onChange={(e) => setLabel(e.target.value)}
          type="number"
        />
      )}
      {collection.properties[id]?.type === "date" && (
        <DateInput
          placeholder={`Enter ${collection.properties[id]?.name}`}
          value={collection.data && collection.data[id]}
          // onChange={(e) => setLabel(e.target.value)}
          type="date"
          mode={mode}
        />
      )}
      {collection.properties[id]?.type === "ethAddress" && (
        <Input
          label=""
          placeholder={`Enter ${collection.properties[id]?.name}`}
          value={collection.data && collection.data[id]}
          // onChange={(e) => setLabel(e.target.value)}
          // error={
          //   collection.data &&
          //   !ethers.utils.isAddress(collection.data && collection.data[id])
          // }
        />
      )}
      {collection.properties[id]?.type === "longText" && (
        <Box
          marginTop="4"
          width="full"
          borderWidth="0.375"
          padding="4"
          borderRadius="large"
          maxHeight="64"
          overflow="auto"
          id="editorContainer"
        >
          <Editor
            placeholder={`Type here to edit ${collection.properties[id]?.name}`}
            isDirty={true}
          />
        </Box>
      )}
      {(collection.properties[id]?.type === "singleSelect" ||
        collection.properties[id]?.type === "user" ||
        collection.properties[id]?.type === "multiSelect" ||
        collection.properties[id]?.type === "user[]") && (
        <Box marginTop="4">
          <Dropdown
            placeholder={`Select ${collection.properties[id]?.name}`}
            multiple={
              collection.properties[id]?.type === "multiSelect" ||
              collection.properties[id]?.type === "user[]"
            }
            options={
              collection.properties[id]?.type === "user" ||
              collection.properties[id]?.type === "user[]"
                ? (memberOptions as any)
                : collection.properties[id]?.options
            }
            selected={collection.data && collection.data[id]}
            onChange={(value: any) => {
              console.log({ value });
            }}
            portal
          />
        </Box>
      )}
      {collection.properties[id]?.type === "reward" && (
        <Box marginTop="4">
          <RewardField
            rewardOptions={collection.properties[id]?.rewardOptions as Registry}
            updateData={() => {}}
            value={{} as any}
          />
        </Box>
      )}
      {collection.properties[id]?.type === "milestone" && (
        <Box marginTop="4" width="full">
          <PrimaryButton
            variant="tertiary"
            icon={<IconPlusSmall />}
            onClick={async () => {}}
          >
            Add new milestone
          </PrimaryButton>
        </Box>
      )}
    </Container>
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

export const DateInput = styled.input<{ mode: string }>`
  padding: 1rem;
  border-radius: 0.55rem;
  border 1px solid ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255,0.1)" : "rgb(20,20,20,0.1)"};
  background-color: ${(props) =>
    props.mode === "dark" ? "rgb(20,20,20)" : "rgb(255, 255, 255)"};
  width: 100%;
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255,0.7)" : "rgb(20,20,20,0.7)"};
  margin-top: 10px;
  outline: none;
  &:focus {
    border-color: rgb(191, 90, 242, 1);
  }
  transition: border-color 0.5s ease;
`;
