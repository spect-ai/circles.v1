/* eslint-disable @typescript-eslint/no-explicit-any */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { MemberDetails, Registry, UserType } from "@/app/types";
import {
  Box,
  Button,
  IconDocumentAdd,
  IconPencil,
  IconPlusSmall,
  IconTrash,
  Input,
  Stack,
  Tag,
  Text,
  useTheme,
} from "degen";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
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
import {
  FaDiscord,
  FaGithub,
  FaTelegramPlane,
  FaTwitter,
} from "react-icons/fa";
import SingleSelect from "@/app/modules/PublicForm/Fields/SingleSelect";
import MultiSelect from "@/app/modules/PublicForm/Fields/MultiSelect";
import RewardField from "@/app/modules/PublicForm/Fields/RewardField";
import { motion } from "framer-motion";
import { updateFormCollection } from "@/app/services/Collection";
import { toast } from "react-toastify";
import { logError } from "@/app/common/utils/utils";
import { Hidden } from "react-grid-system";
import { useAtom } from "jotai";
import { isSidebarExpandedAtom } from "@/app/state/global";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { useScroll } from "react-use";
import Slider from "@/app/common/components/Slider";

type Props = {
  id: string;
  index: number;
  setIsEditFieldOpen: (value: boolean) => void;
  setIsAddFieldOpen: (value: boolean) => void;
  setPropertyId: (value: string) => void;
  formData: any;
  setFormData: (value: any) => void;
  setShowConfirmOnDelete: (value: boolean) => void;
};

function FieldComponent({
  id,
  index,
  setIsEditFieldOpen,
  setIsAddFieldOpen,
  setPropertyId,
  formData,
  setFormData,
  setShowConfirmOnDelete,
}: Props) {
  const {
    localCollection: collection,
    fieldNeedsAttention,
    updateCollection,
    setCurrentPage,
    scrollContainerRef,
  } = useLocalCollection();
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

  const [forceRefresh, setForceRefresh] = useState(true);
  const { formActions } = useRoleGate();
  const { y } = useScroll(scrollContainerRef);

  useEffect(() => {
    // force rerender of the editor component when the description changes
    // this is a hack to get around the fact that the editor component
    // doesn't rerender when the value prop changes
    setForceRefresh(false);
    setTimeout(() => {
      setForceRefresh(true);
    }, 100);
  }, [collection.properties[id]?.description]);

  const DraggableContent = (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => (
    <Container
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      padding={{
        xs: "2",
        md: "4",
      }}
      borderRadius="large"
      isDragging={snapshot.isDragging}
      mode={mode}
      draggable={false}
      className="bounds"
    >
      <Stack direction="vertical" space="1">
        {fieldNeedsAttention[id] && (
          <Text variant="small" color="yellow">
            Needs your attention
          </Text>
        )}
        <Stack direction="horizontal">
          <Box width="full" display="flex" flexDirection="row" gap="2">
            {collection.properties[id]?.type !== "readonly" && (
              <Text weight="semiBold">{collection.properties[id]?.name}</Text>
            )}
            {collection.properties[id].required && (
              <Tag size="small" tone="accent">
                Required
              </Tag>
            )}
            {collection.properties[id].immutable && (
              <Tag size="small" tone="blue">
                Immutable
              </Tag>
            )}
          </Box>
          {/* <Box
            cursor="pointer"
            borderRadius="full"
            paddingY="1"
            paddingX="2"
            onClick={() => {
              setPropertyId(id);
              setIsEditFieldOpen(true);
              process.env.NODE_ENV === "production" &&
                mixpanel.track("Edit Field Button", {
                  user: currentUser?.username,
                  field: collection.properties[id]?.name,
                });
            }}
          >
            <IconPencil color="accent" size="4" />
          </Box> */}
        </Stack>
        <Box>
          {collection.properties[id]?.description && forceRefresh && (
            <Editor
              value={collection.properties[id]?.description}
              disabled
              bounds=".bounds"
              version={collection.editorVersion}
            />
          )}
        </Box>
      </Stack>
      {collection.properties[id]?.type === "shortText" && (
        <Input
          label=""
          placeholder={`Enter short text`}
          value={collection.data && collection.data[id]}
          // onChange={(e) => setLabel(e.target.value)}
        />
      )}
      {collection.properties[id]?.type === "email" && (
        <Input
          label=""
          placeholder={`Enter email`}
          value={collection.data && collection.data[id]}
          inputMode="email"
          // onChange={(e) => setLabel(e.target.value)}
        />
      )}
      {collection.properties[id]?.type === "singleURL" && (
        <Input
          label=""
          placeholder={`Enter URL`}
          value={collection.data && collection.data[id]}
          inputMode="text"
          // onChange={(e) => setLabel(e.target.value)}
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
          placeholder={`Enter URL`}
          value={collection.data && collection.data[id]?.[0]}
          inputMode="text"
          // onChange={(e) => setLabel(e.target.value)}
        />
      )}
      {collection.properties[id]?.type === "number" && (
        <Input
          label=""
          placeholder={`Enter number`}
          value={collection.data && collection.data[id]}
          // onChange={(e) => setLabel(e.target.value)}
          type="number"
        />
      )}
      {collection.properties[id]?.type === "date" && (
        <DateInput
          placeholder={`Enter date`}
          value={collection.data && collection.data[id]}
          // onChange={(e) => setLabel(e.target.value)}
          type="date"
          mode={mode}
        />
      )}
      {collection.properties[id]?.type === "ethAddress" && (
        <Input
          label=""
          placeholder={`Enter ethereum address or ENS`}
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
          padding={{
            xs: "2",
            md: "4",
          }}
          borderRadius="large"
          maxHeight="64"
          overflow="auto"
          id="editorContainer"
        >
          <Editor
            placeholder={`Use / for commands`}
            isDirty={true}
            version={collection.editorVersion}
            bounds=".bounds"
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
            propertyId={id}
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
              } else {
                if (formData[id]?.includes(value)) {
                  setFormData({
                    ...formData,
                    [id]: formData[id].filter((item: any) => item !== value),
                  });
                } else {
                  setFormData({ ...formData, [id]: [...formData[id], value] });
                }
              }
            }}
            propertyId={id}
          />
        </Box>
      )}
      {collection.properties[id]?.type === "slider" && (
        <Slider
          min={collection.properties[id]?.sliderOptions?.min || 1}
          max={collection.properties[id]?.sliderOptions?.max || 10}
          step={collection.properties[id]?.sliderOptions?.step || 1}
          onChange={(value: number | number[]) => {
            setFormData({ ...formData, [id]: value });
          }}
          minLabel={collection.properties[id]?.sliderOptions?.minLabel}
          maxLabel={collection.properties[id]?.sliderOptions?.maxLabel}
          value={formData[id]}
        />
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
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DraggableContentCallback = useCallback(DraggableContent, [
    collection.data,
    collection.properties,
    hover,
    id,
    mode,
    formData,
    fieldNeedsAttention,
    forceRefresh,
  ]);

  return (
    <Box
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      <Stack direction="horizontal">
        <Box width="full">
          <Draggable draggableId={id} index={index}>
            {DraggableContentCallback}
          </Draggable>
        </Box>
        {/* <Hidden xs sm>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hover ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              marginLeft: "-1rem",
            }}
          >
            <Box
              backgroundColor="accentSecondary"
              height="fit"
              padding="1"
              borderRadius="2xLarge"
              marginTop="1"
              style={{
                // position it on the right side of the screen
                position: "absolute",
                // position it 1rem below the top of the screen
                marginLeft: "2rem",
                marginTop: `-${y}px`,
              }}
            >
              <Stack space="3">
                <Button
                  shape="circle"
                  size="extraSmall"
                  variant="transparent"
                  onClick={() => {
                    if (!formActions("manageSettings")) {
                      toast.error(
                        "You do not have permission to edit fields, make sure your role has permission to manage settings"
                      );
                      return;
                    }
                    setIsAddFieldOpen(true);
                  }}
                >
                  <Text color="accent">
                    <IconPlusSmall size="5" />
                  </Text>
                </Button>
                <Button
                  shape="circle"
                  size="extraSmall"
                  variant="transparent"
                  onClick={async () => {
                    if (!formActions("manageSettings")) {
                      toast.error(
                        "You do not have permission to edit fields, make sure your role has permission to manage settings"
                      );
                      return;
                    }
                    process.env.NODE_ENV === "production" &&
                      mixpanel.track("Add Page", {
                        collection: collection.slug,
                        circle: collection.parents[0].slug,
                        user: currentUser?.username,
                      });
                    const pageOrder = collection.formMetadata.pageOrder;
                    const lastIndex = collection.formMetadata.pages["collect"]
                      ? pageOrder.length - 2
                      : pageOrder.length - 1;
                    const newPageId = `page-${lastIndex + 1}`;
                    const res = await updateFormCollection(collection.id, {
                      ...collection,
                      formMetadata: {
                        ...collection.formMetadata,
                        pageOrder: [
                          ...pageOrder.slice(0, lastIndex),
                          newPageId,
                          ...pageOrder.slice(lastIndex),
                        ],
                        pages: {
                          ...collection.formMetadata.pages,
                          [newPageId]: {
                            id: newPageId,
                            name: "New Page",
                            properties: [],
                            movable: true,
                          },
                        },
                      },
                    });
                    setCurrentPage(newPageId);
                    if (res.id) {
                      updateCollection(res);
                    } else {
                      logError("Update collection failed");
                    }
                  }}
                >
                  <Text color="accent">
                    <IconDocumentAdd size="5" />
                  </Text>
                </Button>
                <Button
                  shape="circle"
                  size="extraSmall"
                  variant="transparent"
                  onClick={() => {
                    if (!formActions("manageSettings")) {
                      toast.error(
                        "You do not have permission to edit fields, make sure your role has permission to manage settings"
                      );
                      return;
                    }
                    setPropertyId(id);
                    setShowConfirmOnDelete(true);
                  }}
                >
                  <Text color="red">
                    <IconTrash size="5" />
                  </Text>
                </Button>
              </Stack>
            </Box>
          </motion.div>
        </Hidden> */}
      </Stack>
    </Box>
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
