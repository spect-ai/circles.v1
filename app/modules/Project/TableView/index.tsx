import { CompactTable } from "@table-library/react-table-library/compact";
import { TableNode, Data } from "@table-library/react-table-library/types";

import { Box, Text } from "degen";

import { useLocalProject } from "../Context/LocalProjectContext";
import { SkeletonLoader } from "../SkeletonLoader";
import { CardType } from "@/app/types";

export default function TableView() {
  const { localProject: project, loading } = useLocalProject();
  const columns = [
    { label: "Title", renderCell: (item: TableNode) => item.title },
    {
      label: "Deadline",
      renderCell: (item: TableNode) => item.deadline,
    },
    { label: "Type", renderCell: (item: TableNode) => item.type },
  ];

  const data = Object.values(project.cards)?.map((card) => ({
    id: card.id,
    title: card.title,
    deadline: card.deadline,
    type: card.type,
  }));

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <Box>
      <CompactTable columns={columns} data={{nodes: data}} />
    </Box>
  );
}
