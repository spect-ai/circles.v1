import { Box, Text } from "degen";
import React, { useState } from "react";
import {
  Column,
  DynamicDataSheetGrid,
  keyColumn,
  textColumn,
} from "react-datasheet-grid";
import styled from "styled-components";
import { mockData } from "../Constants";
import SelectComponent from "./SelectComponent";

type Row = {
  title: string;
  description: string;
  status: string;
};

export default function TableView() {
  const [data, setData] = useState<Row[]>(mockData);
  const [sort, setSort] = useState(true);

  const HeaderComponent = ({ columnName }: { columnName: string }) => {
    return (
      <TableHeader
        onClick={() => {
          // sort data if  ascending or descending
          const sorteddata = data.sort((a: any, b: any) => {
            if (sort) {
              return a[columnName].localeCompare(b[columnName]);
            } else {
              return b[columnName].localeCompare(a[columnName]);
            }
          });
          console.log({ sorteddata });
          setData(sorteddata);
          setSort(!sort);
        }}
      >
        <Text variant="label">{columnName}</Text>
      </TableHeader>
    );
  };

  const columns: Column<Row>[] = [
    {
      ...keyColumn<Row, "title">("title", textColumn as any),
      title: <HeaderComponent columnName="title" />,
      minWidth: 200,
    },
    {
      ...keyColumn<Row, "description">("description", textColumn as any),
      title: <HeaderComponent columnName="description" />,
      minWidth: 200,
    },
    {
      component: SelectComponent as any,
      title: <HeaderComponent columnName="status" />,
      minWidth: 200,
    },
  ];
  return (
    <Box padding="8">
      <DynamicDataSheetGrid
        value={data}
        onChange={setData as any}
        columns={columns}
      />
    </Box>
  );
}

const TableHeader = styled(Box)`
  cursor: pointer !important;
  width: 100% !important;
`;
