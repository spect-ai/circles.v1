import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useLocalProject } from "../Context/LocalProjectContext";
import { useGlobal } from "@/app/context/globalContext";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import {
  Box,
  Button,
  IconGrid,
  IconList,
  IconDotsVertical,
  Text,
  useTheme,
} from "degen";
import Link from "next/link";
import CreateViewModal from "./ViewModal/CreateViewModal";
import EditViewModal from "./ViewModal/EditViewModal";
import { AnimatePresence } from "framer-motion";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import styled from "styled-components";

const Container = styled(Box)<{ mode: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.2rem;
  padding: 0.2rem;
  max-width: 40vw;
  overflow: auto;
  ::-webkit-scrollbar {
    width: 6px;
    height: 3px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.2)"
        : "rgb(0, 0, 0, 0.2)"};
    border-radius: 1rem;
  }
`;

export const ViewBar = () => {
  const router = useRouter();
  const { circle: cId, project: pId, view: vId } = router.query;
  const { localProject: project } = useLocalProject();
  const { viewName, setViewName } = useGlobal();
  const { canDo } = useRoleGate();
  const { mode } = useTheme();

  const [openModal, setOpenModal] = useState(false);
  const [viewMode, setViewMode] = useState("");

  useEffect(() => {
    if (!vId) {
      setViewName("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pId]);

  return (
    <>
      <Container mode={mode}>
        {project?.viewOrder?.map((view_Id) => {
          const view = project.viewDetails?.[view_Id];
          return (
            <Link href={`/${cId}/${pId}?view=${view_Id}`} key={view_Id}>
              <Button
                prefix={
                  view?.type == "Board" ? (
                    <IconGrid size="4" />
                  ) : (
                    <IconList size="4" />
                  )
                }
                variant={view_Id == viewName ? "tertiary" : "transparent"}
                size="small"
                suffix={
                  view_Id == viewName && canDo(["steward"]) ? (
                    <>
                      <Box
                        onClick={() => {
                          setViewMode("edit");
                          setOpenModal(true);
                        }}
                      >
                        <IconDotsVertical size="4" />
                      </Box>
                    </>
                  ) : (
                    <></>
                  )
                }
              >
                {view?.name}
              </Button>
            </Link>
          );
        })}
      </Container>
      <Box width="32">
        {project?.name && canDo(["steward"]) && (
          <PrimaryButton
            variant="transparent"
            shape="circle"
            onClick={() => {
              setViewMode("create");
              setOpenModal(true);
            }}
          >
            <Text>Create View</Text>
          </PrimaryButton>
        )}
      </Box>

      <AnimatePresence>
        {openModal && viewMode == "create" && (
          <CreateViewModal setViewOpen={setOpenModal} />
        )}
        {openModal && viewMode == "edit" && (
          <EditViewModal setViewOpen={setOpenModal} viewId={viewName} />
        )}
      </AnimatePresence>
    </>
  );
};
