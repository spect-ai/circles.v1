import { CollectionType, FormType, PublicProjectType } from "@/app/types";
import { Box, Text, useTheme } from "degen";
import { useEffect, useState } from "react";
import {
  CircleContext,
  useProviderCircleContext,
} from "../Circle/CircleContext";
import PublicProjectLayout from "@/app/common/layout/PublicLayout/PublicProjectLayout";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import ProjectTableView from "../CollectionProject/TableView";
import KanbanView from "../CollectionProject/KanbanView";
import ListView from "../CollectionProject/ListView";
import {
  LocalCollectionContext,
  useLocalCollection,
  useProviderLocalCollection,
} from "../Collection/Context/LocalCollectionContext";
import ProjectHeading from "../CollectionProject/Heading";
import { Collection } from "../Collection";

type Props = {};

function ProjectViews() {
  const { projectViewId, localCollection } = useLocalCollection();
  const [loading, setLoading] = useState(false);
  console.log({ projectViewId, localCollection });

  useEffect(() => {
    console.log({ localCollection, projectViewId });
    if (Object.keys(localCollection)?.length > 0 && projectViewId) {
      setLoading(false);
    }
  }, [projectViewId, localCollection]);

  return (
    <Box>
      {localCollection && projectViewId && (
        <>
          <ProjectHeading />
          <Box>
            {localCollection?.projectMetadata.views[projectViewId]?.type ===
              "grid" && <ProjectTableView />}
            {localCollection?.projectMetadata.views[projectViewId]?.type ===
              "kanban" && <KanbanView />}
            {localCollection?.projectMetadata.views[projectViewId]?.type ===
              "list" && <ListView />}
          </Box>
        </>
      )}
    </Box>
  );
}

function PublicProject({}: Props) {
  const { mode } = useTheme();
  const context = useProviderCircleContext();
  const projectContext = useProviderLocalCollection();

  return (
    <CircleContext.Provider value={context}>
      <LocalCollectionContext.Provider value={projectContext}>
        <PublicProjectLayout>
          <ScrollContainer backgroundColor={"backgroundSecondary"}>
            <ToastContainer
              toastStyle={{
                backgroundColor: `${
                  mode === "dark" ? "rgb(20,20,20)" : "rgb(240,240,240)"
                }`,
                color: `${
                  mode === "dark" ? "rgb(255,255,255,0.7)" : "rgb(20,20,20,0.7)"
                }`,
              }}
            />

            <Collection />
          </ScrollContainer>
        </PublicProjectLayout>
      </LocalCollectionContext.Provider>
    </CircleContext.Provider>
  );
}

export default PublicProject;

const ScrollContainer = styled(Box)`
  &::-webkit-scrollbar {
    width: 0.2rem;
  }
  height: 100vh;
  overflow-y: auto;
`;

const Container = styled(Box)<{ embed: boolean }>`
  @media (max-width: 768px) {
    padding: 0rem ${(props) => (props.embed ? "0rem" : "1rem")};
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    padding: ${(props) => (props.embed ? "0rem" : "2rem")}
      ${(props) => (props.embed ? "0rem" : "4rem")};
  }

  @media (min-width: 1024px) and (max-width: 1280px) {
    padding: ${(props) => (props.embed ? "0rem" : "2rem")}
      ${(props) => (props.embed ? "0rem" : "14rem")};
  }

  &::-webkit-scrollbar {
    width: 0.5rem;
  }
  z-index: 999;
  margin-top: ${(props) => (props.embed ? "0rem" : "-8rem")};
  padding: 0rem ${(props) => (props.embed ? "0rem" : "14rem")};
`;
