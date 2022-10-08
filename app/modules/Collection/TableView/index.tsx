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
import HeaderComponent from "./HeaderComponent";
import SelectComponent from "./SelectComponent";

type Row = {
  title: string;
  description: string;
  status: string;
};

export default function TableView() {
  const [data, setData] = useState<Row[]>(mockData);

  const sortData = (columnName: string, asc: boolean) => {
    const sortedData = [...data].sort((a: any, b: any) => {
      if (a[columnName] < b[columnName]) {
        return asc ? -1 : 1;
      }
      if (a[columnName] > b[columnName]) {
        return asc ? 1 : -1;
      }
      return 0;
    });
    setData(sortedData);
  };

  const columns: Column<Row>[] = [
    {
      ...keyColumn<Row, "title">("title", textColumn as any),
      title: <HeaderComponent columnName="title" sortData={sortData} />,
      minWidth: 200,
    },
    {
      ...keyColumn<Row, "description">("description", textColumn as any),
      title: <HeaderComponent columnName="description" sortData={sortData} />,
      minWidth: 200,
    },
    {
      component: SelectComponent as any,
      title: <HeaderComponent columnName="status" sortData={sortData} />,
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
