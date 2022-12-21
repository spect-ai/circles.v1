import { Box, IconPlusSmall, Stack, Text, useTheme } from "degen";
import React, { useState } from "react";
import TableView from "../../Collection/TableView";
import mixpanel from "@/app/common/utils/mixpanel";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import AddField from "../../Collection/AddField";
import { AnimatePresence } from "framer-motion";
import styled from "styled-components";
import CardDrawer from "../CardDrawer";
import { useRouter } from "next/router";

export default function ProjectTableView() {
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [isCardDrawerOpen, setIsCardDrawerOpen] = useState(false);
  const router = useRouter();

  const { mode } = useTheme();

  return (
    <Box>
      <AnimatePresence>
        {isAddFieldOpen && (
          <AddField handleClose={() => setIsAddFieldOpen(false)} />
        )}
        {isCardDrawerOpen && (
          <CardDrawer handleClose={() => setIsCardDrawerOpen(false)} />
        )}
      </AnimatePresence>
      <Box
        overflow="auto"
        paddingY="2"
        marginRight={{
          xs: "2",
          md: "8",
        }}
        marginLeft={{
          xs: "2",
          md: "8",
        }}
      >
        <Stack direction="horizontal" space="0">
          <TableView />
          <Box>
            <AddFieldButton
              mode={mode}
              onClick={() => {
                setIsAddFieldOpen(true);
                process.env.NODE_ENV === "production" &&
                  mixpanel.track("Add Field Button", {
                    user: currentUser?.username,
                  });
              }}
            >
              <Text color="accent">
                <IconPlusSmall />
              </Text>
            </AddFieldButton>
          </Box>
        </Stack>
        <AddRowButton
          mode={mode}
          onClick={() => {
            setIsCardDrawerOpen(true);
            void router.push({
              pathname: router.pathname,
              query: {
                circle: router.query.circle,
                collection: router.query.collection,
                newCard: true,
              },
            });
            process.env.NODE_ENV === "production" &&
              mixpanel.track("Add Row Button", {
                user: currentUser?.username,
              });
          }}
        >
          <Stack direction="horizontal">
            <Text color="accent">
              <IconPlusSmall />
            </Text>
            <Text>Add Row</Text>
          </Stack>
        </AddRowButton>
      </Box>
    </Box>
  );
}

const AddFieldButton = styled.div<{ mode: string }>`
  background: ${(props) =>
    props.mode === "dark" ? "rgb(20, 20, 20)" : "rgb(255, 255, 255)"};
  border-right: 1px solid
    ${(props) =>
      props.mode === "dark" ? "rgb(40, 40, 40)" : "rgb(240, 240, 240)"};

  border-top: 1px solid
    ${(props) =>
      props.mode === "dark" ? "rgb(40, 40, 40)" : "rgb(240, 240, 240)"};

  border-bottom: 1px solid
    ${(props) =>
      props.mode === "dark" ? "rgb(40, 40, 40)" : "rgb(240, 240, 240)"};

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  cursor: pointer;
  &:hover {
    background: ${(props) =>
      props.mode === "dark" ? "rgb(40, 40, 40)" : "rgb(240, 240, 240)"};
  }
  transition: background 0.2s ease;
  width: 120px;
  height: 42px;
`;

const AddRowButton = styled.div<{ mode: string }>`
  background: ${(props) =>
    props.mode === "dark" ? "rgb(20, 20, 20)" : "rgb(255, 255, 255)"};
  border-right: 1px solid
    ${(props) =>
      props.mode === "dark" ? "rgb(40, 40, 40)" : "rgb(240, 240, 240)"};

  border-top: 1px solid
    ${(props) =>
      props.mode === "dark" ? "rgb(40, 40, 40)" : "rgb(240, 240, 240)"};

  border-bottom: 1px solid
    ${(props) =>
      props.mode === "dark" ? "rgb(40, 40, 40)" : "rgb(240, 240, 240)"};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  cursor: pointer;
  &:hover {
    background: ${(props) =>
      props.mode === "dark" ? "rgb(40, 40, 40)" : "rgb(240, 240, 240)"};
  }
  transition: background 0.2s ease;
  width: 251px;
  height: 41px;
`;
