import { FC } from "react";

import { Box, Stack, Text, useTheme } from "degen";
import { Col, Row } from "react-grid-system";
import CheckBox from "./Checkbox";
import styled from "styled-components";

interface Props {
  columns: string[];
  columnWidths?: {
    [key: string]: number[];
  };
  rows: React.ReactNode[][];
  onClick?: (checked: boolean[]) => void;
  blurColumns?: boolean[];
}

const Table: FC<Props> = ({
  columns,
  rows,
  columnWidths,
  onClick,
  blurColumns,
}) => {
  return (
    <Box
      borderColor="foregroundSecondary"
      borderWidth="0.5"
      borderRadius="medium"
      padding="2"
    >
      <Row>
        {columns.map((column, index) => (
          <Col
            key={index}
            xs={columnWidths?.["xs"]?.[index] || 6}
            sm={columnWidths?.["sm"]?.[index] || 6}
            md={columnWidths?.["md"]?.[index] || 6}
            lg={columnWidths?.["lg"]?.[index] || 6}
          >
            <Box padding="2">
              <Text variant="label">{column}</Text>
            </Box>
          </Col>
        ))}
      </Row>
      {rows.map((row, index) => (
        <Row key={index}>
          {row.map((cell, index) => (
            <Col
              key={index}
              xs={columnWidths?.["xs"]?.[index] || 6}
              sm={columnWidths?.["sm"]?.[index] || 6}
              md={columnWidths?.["md"]?.[index] || 6}
              lg={columnWidths?.["lg"]?.[index] || 6}
            >
              <Box
                padding="2"
                style={{
                  filter: blurColumns?.[index] ? "blur(7px)" : "none",
                }}
              >
                <Text> {cell}</Text>
              </Box>
            </Col>
          ))}
        </Row>
      ))}
    </Box>
  );
};

export default Table;

export type { Props as TableProps };
