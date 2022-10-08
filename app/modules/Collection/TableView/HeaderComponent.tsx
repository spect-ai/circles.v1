import { Box, Text } from "degen";
import React, { useState } from "react";
import styled from "styled-components";

type Props = {
  columnName: string;
  data: any;
  setData: (data: any) => void;
};

export default function HeaderComponent({ columnName, data, setData }: Props) {
  const [sort, setSort] = useState(true);
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
}

const TableHeader = styled(Box)`
  cursor: pointer !important;
  width: 100% !important;
`;
