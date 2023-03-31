import { memo, useCallback } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import {
  Box,
  Text,
  useTheme,
  Stack,
  IconUserGroup,
  IconLightningBolt,
} from "degen";
import { CircleType, ProjectType, RetroType, UserType } from "@/app/types";
import styled from "styled-components";
import { ProjectOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { getViewIcon } from "@/app/modules/CollectionProject/Heading";
import { Table } from "react-feather";
import mixpanel from "mixpanel-browser";
import { useCircle } from "../../CircleContext";
import { useQuery } from "react-query";

interface Props {
  card: string;
  index: number;
  projects?: {
    [key: string]: ProjectType;
  };
  workstreams?: {
    [key: string]: CircleType;
  };
  retros?: {
    [key: string]: RetroType;
  };
  collections?: {
    [key: string]: {
      id: string;
      name: string;
      slug: string;
      viewType?: string;
      collectionType: 0 | 1;
      archived: boolean;
    };
  };
}

const Container = styled(Box)<{ isDragging: boolean; mode: string }>`
  border-width: 1px;
  border-color: ${(props) =>
    props.isDragging
      ? "rgb(191, 90, 242, 1)"
      : props.mode === "dark"
      ? "rgb(255, 255, 255, 0.05)"
      : "rgb(20,20,20,0.05)"};
  };
  &:hover {
    border-color: ${(props) =>
      props.mode === "dark" ? "rgb(255, 255, 255, 0.1)" : "rgb(20,20,20,0.1)"};
  }
  color: rgb(191, 90, 242, 0.7);
  width: 20rem;
  height: 6rem;
  overflow-x: hidden;
`;

const Card = ({
  card,
  index,
  projects,
  workstreams,
  retros,
  collections,
}: Props) => {
  const { mode } = useTheme();
  const router = useRouter();
  const { circle: cId } = router.query;

  const { circle } = useCircle();

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const DraggableContent = (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => (
    <Container
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      padding="4"
      borderRadius="large"
      isDragging={snapshot.isDragging}
      mode={mode}
      onClick={() => {
        if (projects?.[card]?.slug) {
          void router.push(`/${cId}/${projects?.[card]?.slug}`);
        }
        if (workstreams?.[card]?.slug) {
          void router.push(`/${workstreams?.[card]?.slug}`);
        }
        if (retros?.[card]?.slug) {
          void router.push(`/${cId}?retroSlug=${retros?.[card]?.slug}`);
        }
        if (collections?.[card]?.slug) {
          process.env.NODE_ENV === "production" &&
            mixpanel.track(`Collection clicked`, {
              circle: circle?.slug,
              form: collections?.[card]?.slug,
              user: currentUser?.username,
            });
          void router.push(`/${cId}/r/${collections?.[card]?.slug}`);
        }
      }}
    >
      {projects?.[card]?.id && (
        <>
          <Stack direction={"horizontal"} align="center" justify={"flex-start"}>
            <Box display={"block"}>
              <ProjectOutlined style={{ fontSize: "1.1rem" }} />
            </Box>
            <Text ellipsis variant="base" weight={"semiBold"}>
              {projects?.[card]?.name}
            </Text>
          </Stack>
          <Box paddingTop={"2"}>
            <Text color={"textSecondary"} ellipsis>
              {projects?.[card]?.description}
            </Text>
          </Box>
        </>
      )}
      {workstreams?.[card]?.id && (
        <>
          <Stack direction={"horizontal"} align="center" justify={"flex-start"}>
            <Box display={"block"}>
              <IconUserGroup size={"5"} />
            </Box>
            <Text ellipsis variant="base" weight={"semiBold"}>
              {workstreams?.[card]?.name}
            </Text>
          </Stack>
          <Box paddingTop={"2"}>
            <Text color={"textSecondary"} ellipsis>
              {workstreams?.[card]?.description}
            </Text>
          </Box>
        </>
      )}
      {retros?.[card]?.id && (
        <>
          <Stack direction={"horizontal"} align="center" justify={"flex-start"}>
            <Box display={"block"}>
              <IconLightningBolt size={"5"} />
            </Box>
            <Text ellipsis variant="base" weight={"semiBold"}>
              {retros?.[card]?.title}
            </Text>
          </Stack>
          <Box paddingTop={"2"}>
            <Text color={"textSecondary"} ellipsis>
              {retros?.[card]?.description}
            </Text>
          </Box>
        </>
      )}
      {collections?.[card]?.id && (
        <>
          <Stack direction={"horizontal"} align="center" justify={"flex-start"}>
            <Box display={"block"}>
              {collections?.[card].viewType ? (
                getViewIcon(collections?.[card].viewType || "")
              ) : (
                <Table size={18} style={{ marginTop: 4 }} />
              )}
            </Box>
            <Text ellipsis variant="base" weight={"semiBold"}>
              {collections?.[card]?.name}
            </Text>
          </Stack>
          <Box paddingTop={"2"}></Box>
        </>
      )}
      {/* <Stack direction={"horizontal"} align="center" justify={"flex-start"}>
        <Box display={"block"}>
          {projects?.[card]?.id && (
            <ProjectOutlined style={{ fontSize: "1.1rem" }} />
          )}
          {workstreams?.[card]?.id && <IconUserGroup size={"5"} />}
          {retros?.[card]?.id && <IconLightningBolt size={"5"} />}
          {collections?.[card]?.id &&
            (collections?.[card].viewType ? (
              getViewIcon(collections?.[card].viewType || "")
            ) : (
              <Table size={18} style={{ marginTop: 4 }} />
            ))}
        </Box>

        <Text ellipsis variant="base" weight={"semiBold"}>
          {projects?.[card]?.name ||
            workstreams?.[card].name ||
            retros?.[card].title ||
            collections?.[card].name}
        </Text>
      </Stack>
      <Box paddingTop={"2"}>
        <Text color={"textSecondary"} ellipsis>
          {projects?.[card]?.description ||
            workstreams?.[card].description ||
            retros?.[card]?.description}
        </Text>
      </Box> */}
    </Container>
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DraggableContentCallback = useCallback(DraggableContent, [
    projects,
    card,
    workstreams,
    retros,
    mode,
  ]);

  return (
    <Draggable draggableId={card} index={index}>
      {DraggableContentCallback}
    </Draggable>
  );
};

export default memo(Card);
