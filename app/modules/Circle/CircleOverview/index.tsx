import { useGlobal } from "@/app/context/globalContext";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { CircleType, ProjectType } from "@/app/types";
import { Box, Button, Stack, Text, useTheme, Input, IconSearch } from "degen";
import { AnimatePresence } from "framer-motion";
import { matchSorter } from "match-sorter";
import { useRouter } from "next/router";
import React, { useEffect, useState, FunctionComponent } from "react";
import styled from "styled-components";
import BatchPay from "../../Project/BatchPay";
import RetroModal from "../../Retro/RetroModal";
import { useCircle } from "../CircleContext";
import CircleMembers from "../CircleMembers";
import InviteMemberModal from "../ContributorsModal/InviteMembersModal";
import { TypeView } from "./TypeView";
import { FolderView } from "./FolderView";
import { UngroupOutlined } from "@ant-design/icons";

interface Props {
  toggle: string;
  setToggle: (toggle: "Overview" | "Members" | "Roles") => void;
}

const ToggleButton = styled.button<{ bgcolor: boolean }>`
  border-radius: 2rem;
  border: none;
  padding: 0.4rem 1rem;
  text-align: center;
  cursor: pointer;
  font-weight: 600;
  font-family: Inter;
  font-size: 1rem;
  transition-duration: 0.4s;
  color: ${(props) =>
    props.bgcolor ? "rgb(191,90,242)" : "rgb(191,90,242,0.8)"};
  background-color: ${(props) =>
    props.bgcolor ? "rgb(191,90,242,0.1)" : "transparent"};
`;

const Toggle: FunctionComponent<Props> = ({ toggle, setToggle }) => {
  const { mode } = useTheme();

  return (
    <Box
      backgroundColor={mode === "dark" ? "background" : "white"}
      style={{
        display: "block",
        padding: "0.2rem",
        borderRadius: "2rem",
        width: "13.6rem",
        margin: "1rem auto",
        boxShadow: `0px 1px 5px ${
          mode == "dark" ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)"
        }`,
      }}
    >
      <ToggleButton
        onClick={() => setToggle("Overview")}
        bgcolor={toggle == "Overview" ? true : false}
      >
        Overview
      </ToggleButton>
      <ToggleButton
        onClick={() => setToggle("Members")}
        bgcolor={toggle == "Members" ? true : false}
      >
        Members
      </ToggleButton>
    </Box>
  );
};

export default function CircleOverview() {
  const { isSidebarExpanded } = useGlobal();
  const router = useRouter();
  const { circle: cId, retroSlug } = router.query;
  const {
    localCircle: circle,
    setIsBatchPayOpen,
    isBatchPayOpen,
    retro,
    loading,
  } = useCircle();
  const { canDo } = useRoleGate();
  const [isRetroOpen, setIsRetroOpen] = useState(false);
  const [toggle, setToggle] =
    useState<"Overview" | "Members" | "Roles">("Overview");
  const [groupBy, setGroupBy] = useState<"Folder" | "Type">("Folder");
  const [filteredProjects, setFilteredProjects] = useState(circle?.projects);
  const [filteredCollections, setFilteredCollections] = useState(
    circle?.collections
  );
  const [filteredWorkstreams, setFilteredWorkstreams] = useState(
    circle?.children
  );
  const [filteredRetro, setFilteredRetro] = useState(circle?.retro);

  useEffect(() => {
    setFilteredProjects(circle?.projects);
    setFilteredWorkstreams(circle?.children);
    setFilteredRetro(circle?.retro);
  }, [circle]);

  useEffect(() => {
    if (retroSlug) {
      setIsRetroOpen(true);
    }
  }, [retroSlug]);

  if (circle?.unauthorized)
    return (
      <>
        <Text size="headingTwo" weight="semiBold" ellipsis>
          This circle is private
        </Text>
        <Button
          size="large"
          variant="transparent"
          onClick={() => router.back()}
        >
          <Text size="extraLarge">Go Back</Text>
        </Button>
      </>
    );

  if (loading) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {isRetroOpen && (
          <RetroModal
            handleClose={() => {
              setIsRetroOpen(false);
              void router.push(`/${cId}`);
            }}
          />
        )}
        {isBatchPayOpen && (
          <BatchPay setIsOpen={setIsBatchPayOpen} retro={retro} />
        )}
      </AnimatePresence>
      <Stack direction="horizontal">
        <Box
          style={{
            width: isSidebarExpanded ? "75%" : "100%",
            alignItems: "center",
          }}
          transitionDuration="500"
        >
          <Toggle toggle={toggle} setToggle={setToggle} />
          {toggle == "Overview" && (
            <>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <Input
                  label=""
                  placeholder="Search anything .."
                  prefix={<IconSearch />}
                  onChange={(e) => {
                    // setFilteredProjects(
                    //   matchSorter(
                    //     circle?.projects,
                    //     e.target.value,
                    //     {
                    //       keys: ["name"],
                    //     }
                    //   )
                    // );
                    // setFilteredWorkstreams(
                    //   matchSorter(circle?.children, e.target.value, {
                    //     keys: ["name"],
                    //   })
                    // );
                    // setFilteredRetro(
                    //   matchSorter(circle?.retro, e.target.value, {
                    //     keys: ["title"],
                    //   })
                    // );
                    setFilteredCollections(
                      matchSorter(circle?.collections, e.target.value, {
                        keys: ["name"],
                      })
                    );
                  }}
                />
                <Box
                  cursor="pointer"
                  color={"accent"}
                  onClick={() =>
                    setGroupBy(groupBy == "Type" ? "Folder" : "Type")
                  }
                >
                  <UngroupOutlined />
                </Box>
                {canDo("inviteMembers") && (
                  <Box width={"1/3"} marginTop="2">
                    <InviteMemberModal />
                  </Box>
                )}
              </Box>
              {groupBy == "Type" && (
                <TypeView
                  filteredCollections={filteredCollections}
                  filteredRetro={filteredRetro}
                  filteredProjects={filteredProjects}
                  filteredWorkstreams={filteredWorkstreams}
                  setIsRetroOpen={setIsRetroOpen}
                />
              )}
              {groupBy == "Folder" && (
                <FolderView
                  filteredCollections={filteredCollections}
                  filteredRetro={filteredRetro}
                  filteredProjects={filteredProjects}
                  filteredWorkstreams={filteredWorkstreams}
                  setIsRetroOpen={setIsRetroOpen}
                />
              )}
            </>
          )}
          {toggle == "Members" && <CircleMembers />}
        </Box>
      </Stack>
    </>
  );
}
