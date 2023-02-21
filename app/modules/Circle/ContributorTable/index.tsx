import { CompactTable } from "@table-library/react-table-library/compact";
import { TableNode } from "@table-library/react-table-library/types";
import { useTheme as useTableTheme } from "@table-library/react-table-library/theme";
import styled from "styled-components";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { useTheme, IconPencil, Box, Text, Avatar, Tag, Stack } from "degen";
import Link from "next/link";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { RolesModal } from "./RolesModal";

interface Props {
  filteredMembers: {
    name: string;
    id: string;
  }[];
}

const IconBox = styled(Box)`
  &:hover {
    background-color: rgb(191, 90, 242, 0.1);
  }
  align-items: center;
  color: rgb(191, 90, 242, 1);
  cursor: pointer;
  padding: 0.6rem;
  border-radius: 1rem;
`;

const Container = styled.div`
  height: calc(100vh - 7.5rem);
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media only screen and (min-width: 0px) {
    max-width: calc(100vw - 5rem);
    padding: 0 0.1rem;
  }
  @media only screen and (min-width: 768px) {
    max-width: calc(100vw - 4rem);
    padding: 0 0.5rem;
  }
`;

function ContributorTable({ filteredMembers }: Props) {
  const { mode } = useTheme();
  const { circle, memberDetails, fetchMemberDetails } = useCircle();
  const [roleModal, setRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const { canDo } = useRoleGate();

  useEffect(() => {
    fetchMemberDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleModal]);

  const theme = useTableTheme({
    Table: `--data-table-library_grid-template-columns:  30% 70%;
    ::-webkit-scrollbar {
      display: none;
    }
    height: ${
      filteredMembers?.length < 10
        ? `calc(${filteredMembers?.length + 1}*52px)`
        : "90%"
    };
    border: 1px solid ${
      mode === "dark" ? "rgb(255, 255, 255, 0.05);" : "rgb(0, 0, 0, 0.05)"
    };
    border-radius: 0.5rem;
    `,
    Header: `
      `,
    Body: ``,
    BaseRow: `
    background-color: ${
      mode === "dark" ? "rgb(20,20,20)" : "rgb(250, 250, 250)"
    };
    `,
    HeaderRow: `
      font-size: 16px;
      color: ${
        mode === "dark" ? "rgb(255, 255, 255, 0.4)" : "rgb(20, 20, 20, 0.7)"
      };
      z-index: 0;
  
      .th {
        border-bottom: 1px solid ${
          mode === "dark" ? "rgb(255, 255, 255, 0.05);" : "rgb(0, 0, 0, 0.05)"
        };
      }
    `,
    Row: `
      font-size: 12px;
      color: grey;
    `,
    BaseCell: `
      border-bottom: 1px solid ${
        mode === "dark" ? "rgb(255, 255, 255, 0.05);" : "rgb(0, 0, 0, 0.05)"
      };
      border-right: 1px solid ${
        mode === "dark" ? "rgb(255, 255, 255, 0.05);" : "rgb(0, 0, 0, 0.05)"
      };
  
      padding: 8px;
      height: 52px;

      &:nth-of-type(1) {
        left: 0px;
      }
    `,
    HeaderCell: ``,
    Cell: ``,
  });

  const columns = [
    {
      label: "Fren",
      renderCell: (item: TableNode) => (
        <Link href={`profile/${item?.username}`}>
          <Box
            width="fit"
            display="flex"
            alignItems="center"
            marginLeft="2"
            style={{ cursor: "pointer" }}
          >
            <Avatar
              src={item?.avatar}
              placeholder={!item?.avatar}
              label="Avatar"
              address={item?.ethAddress}
              size="6"
            />
            <Box marginLeft="2">
              <Text variant="base">{item?.username}</Text>
            </Box>
          </Box>
        </Link>
      ),
      resize: true,
    },
    {
      label: "Role",
      renderCell: (item: TableNode) => (
        <Stack direction="horizontal" wrap align="center" space="1">
          {item?.roles &&
            item?.roles?.map((role: string) => {
              return (
                <Tag key={role} tone="accent" hover>
                  {circle.roles[role].name}
                </Tag>
              );
            })}
          {canDo("manageMembers") && (
            <IconBox
              transitionDuration="300"
              onClick={() => {
                setSelectedUser(item.id);
                setRoleModal(true);
              }}
            >
              <IconPencil size="3" />
            </IconBox>
          )}
        </Stack>
      ),
      resize: true,
    },
  ];
  const data =
    filteredMembers &&
    filteredMembers?.map((mem) => ({
      id: mem.id,
      roles: circle?.memberRoles[mem.id],
      avatar: memberDetails?.memberDetails[mem.id]?.avatar,
      address: memberDetails?.memberDetails[mem.id]?.ethAddress,
      username: memberDetails?.memberDetails[mem.id]?.username,
    }));
  return (
    <>
      <Container>
        <CompactTable
          columns={columns}
          theme={theme}
          data={{ nodes: data as any }}
          layout={{ custom: true, horizontalScroll: true, fixedHeader: true }}
        />
      </Container>

      <AnimatePresence>
        {roleModal && (
          <RolesModal
            handleClose={() => setRoleModal(false)}
            user={selectedUser}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default ContributorTable;
