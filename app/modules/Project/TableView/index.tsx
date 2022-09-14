import { CompactTable } from "@table-library/react-table-library/compact";
import { TableNode } from "@table-library/react-table-library/types";
import { useTheme as useTableTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";

import { Box } from "degen";

import { useLocalProject } from "../Context/LocalProjectContext";
import { SkeletonLoader } from "../SkeletonLoader";

import { CardTitle } from "./components/CardTitle";
import { CardType } from "./components/CardType";
import { CardColumn } from "./components/CardColumn";
import { CardProject } from "./components/CardProject";

export default function TableView() {
  const { localProject: project, loading } = useLocalProject();
  const theme = useTableTheme(getTheme());

  const columns = [
    {
      label: "Title",
      renderCell: (item: TableNode) => (
        <CardTitle name={item.title} id={item.id} />
      ),
    },
    {
      label: "Type",
      renderCell: (item: TableNode) => (
        <CardType id={item.id} type={item.type} />
      ),
    },
    {
      label: "Status",
      renderCell: (item: TableNode) => <CardColumn id={item.id} />,
    },
    {
      label: "Project",
      renderCell: (item: TableNode) => <CardProject id={item.id} />,
    },
  ];

  const data =
    project.cards &&
    Object.values(project.cards)?.map((card) => ({
      id: card.id,
      title: card.title,
      type: card.type,
    }));

  if (loading || !project.cards) {
    return <SkeletonLoader />;
  }

  return (
    <Box>
      <CompactTable columns={columns} theme={theme} data={{ nodes: data }} />
    </Box>
  );
}
