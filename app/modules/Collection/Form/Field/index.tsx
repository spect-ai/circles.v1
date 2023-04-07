/* eslint-disable @typescript-eslint/no-explicit-any */
import PrimaryButton from "@/app/common/components/PrimaryButton";
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
import { memo } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useQuery } from "react-query";
import styled from "styled-components";
import mixpanel from "@/app/common/utils/mixpanel";
import Editor from "@/app/common/components/Editor";
import {
  FaDiscord,
  FaGithub,
  FaTelegramPlane,
  FaTwitter,
} from "react-icons/fa";
import SingleSelect from "@/app/modules/PublicForm/Fields/SingleSelect";
import MultiSelect from "@/app/modules/PublicForm/Fields/MultiSelect";
import RewardField from "@/app/modules/PublicForm/Fields/RewardField";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

type Props = {
  id: string;
  index: number;
  setIsEditFieldOpen: (value: boolean) => void;
  setPropertyName: (value: string) => void;
  formData: any;
  setFormData: (value: any) => void;
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

const FieldComponent = ({
  id,
  index,
  setIsEditFieldOpen,
  setPropertyName,
  formData,
  setFormData,
}: Props) => {
  const { localCollection: collection, fieldNeedsAttention } =
    useLocalCollection();
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

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          padding="4"
          margin="1"
          borderRadius="large"
          isDragging={snapshot.isDragging}
          mode={mode}
        >
          <Stack direction="vertical" space="1">
            {fieldNeedsAttention[id] && (
              <Text variant="small" color="yellow">
                Needs your attention
              </Text>
            )}
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
          </Stack>
          {collection.properties[id]?.type === "shortText" && (
            <Input
              label=""
              placeholder="Enter short text"
              value={collection.data && collection.data[id]}
            />
          )}
          {collection.properties[id]?.type === "email" && (
            <Input
              label=""
              placeholder="Enter email"
              value={collection.data && collection.data[id]}
              inputMode="email"
            />
          )}
          {collection.properties[id]?.type === "singleURL" && (
            <Input
              label=""
              placeholder="Enter URL"
              value={collection.data && collection.data[id]}
              inputMode="text"
            />
          )}
          {collection.properties[id]?.type === "payWall" && (
            <Box marginTop="2">
              <PrimaryButton>Pay</PrimaryButton>
            </Box>
          )}
          {collection.properties[id]?.type === "multiURL" && (
            <Input
              label=""
              placeholder="Enter URL"
              value={collection.data && collection.data[id]?.[0]}
              inputMode="text"
            />
          )}
          {collection.properties[id]?.type === "number" && (
            <Input
              label=""
              placeholder="Enter number"
              value={collection.data && collection.data[id]}
              // onChange={(e) => setLabel(e.target.value)}
              type="number"
            />
          )}
          {collection.properties[id]?.type === "date" && (
            <DateInput
              placeholder="Enter date"
              value={collection.data && collection.data[id]}
              // onChange={(e) => setLabel(e.target.value)}
              type="date"
              mode={mode}
            />
          )}
          {collection.properties[id]?.type === "ethAddress" && (
            <Input
              label=""
              placeholder="Enter ethereum address or ENS"
              value={collection.data && collection.data[id]}
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
                placeholder="Enter long text, use / for commands"
                isDirty
              />
            </Box>
          )}
          {(collection.properties[id]?.type === "singleSelect" ||
            collection.properties[id]?.type === "user") && (
            <Box marginTop="4">
              <SingleSelect
                allowCustom={collection.properties[id]?.allowCustom || false}
                options={
                  collection.properties[id]?.type === "user"
                    ? (memberOptions as any)
                    : collection.properties[id]?.options
                }
                selected={formData[id]}
                onSelect={(value: any) => {
                  setFormData({ ...formData, [id]: value });
                }}
                propertyName={id}
              />
            </Box>
          )}
          {(collection.properties[id]?.type === "multiSelect" ||
            collection.properties[id]?.type === "user[]") && (
            <Box marginTop="4">
              <MultiSelect
                allowCustom={collection.properties[id]?.allowCustom || false}
                options={
                  collection.properties[id]?.type === "user[]"
                    ? (memberOptions as any)
                    : collection.properties[id]?.options
                }
                selected={formData[id]}
                onSelect={(value: any) => {
                  if (!formData[id]) {
                    setFormData({ [id]: [value] });
                  } else if (formData[id]?.includes(value)) {
                    setFormData({
                      ...formData,
                      [id]: formData[id].filter((item: any) => item !== value),
                    });
                  } else {
                    setFormData({
                      ...formData,
                      [id]: [...formData[id], value],
                    });
                  }
                }}
                propertyName={id}
              />
            </Box>
          )}
          {collection.properties[id]?.type === "reward" && (
            <Box marginTop="4">
              <RewardField
                rewardOptions={
                  collection.properties[id]?.rewardOptions as Registry
                }
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
          {collection.properties[id]?.type === "discord" && (
            <Box marginTop="4" width="64">
              <PrimaryButton
                variant="tertiary"
                icon={<FaDiscord size={24} />}
                onClick={async () => {}}
              >
                Connect Discord
              </PrimaryButton>
            </Box>
          )}
          {collection.properties[id]?.type === "twitter" && (
            <Box marginTop="4" width="64">
              <PrimaryButton
                variant="tertiary"
                icon={<FaTwitter size={24} />}
                onClick={async () => {}}
              >
                Connect Twitter
              </PrimaryButton>
            </Box>
          )}
          {collection.properties[id]?.type === "telegram" && (
            <Box marginTop="4" width="64">
              <PrimaryButton
                variant="tertiary"
                icon={<FaTelegramPlane size={24} />}
                onClick={async () => {}}
              >
                Connect Telegram
              </PrimaryButton>
            </Box>
          )}
          {collection.properties[id]?.type === "github" && (
            <Box marginTop="4" width="64">
              <PrimaryButton
                variant="tertiary"
                icon={<FaGithub size={24} />}
                onClick={async () => {}}
              >
                Connect Github
              </PrimaryButton>
            </Box>
          )}
        </Container>
      )}
    </Draggable>
  );
};

export default memo(FieldComponent);
