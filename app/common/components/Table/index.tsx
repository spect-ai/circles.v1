/* eslint-disable react/no-array-index-key */
import { FC } from "react";

import { Box, Stack, Text } from "degen";
import { Col, Row } from "react-grid-system";
import CheckBox from "./Checkbox";

interface Props {
  columns: string[];
  rows: React.ReactNode[][];
  checked?: boolean[];
  showButton?: boolean;
  onClick?: (checked: boolean[]) => void;
}

const Table: FC<Props> = ({
  columns,
  rows,
  showButton = false,
  checked,
  onClick,
}) => (
  <Box width="full">
    <Stack space="6">
      <Row>
        <Box width="full">
          <Stack direction="horizontal" align="center">
            {showButton && checked && (
              <Box marginRight="4" marginLeft="4" marginTop="0.5">
                <CheckBox
                  isChecked={checked.every((ele) => ele === true)}
                  onClick={() => {
                    // set every element to true
                    onClick && onClick(checked.map(() => true));
                  }}
                />
              </Box>
            )}
            {columns.map((column, index) => (
              <Col key={index} xs={12} sm={6}>
                <Text variant="label">{column}</Text>
              </Col>
            ))}
          </Stack>
        </Box>
      </Row>
      {rows.map((row, index) => (
        <Row key={index}>
          <Box width="full">
            <Stack direction="horizontal" align="center">
              {showButton && checked && (
                <Box marginRight="4" marginLeft="4" marginTop="0.5">
                  <CheckBox
                    isChecked={checked[index]}
                    onClick={() => {
                      // set the element to the opposite of what it is
                      onClick &&
                        onClick([
                          ...checked.slice(0, index),
                          !checked[index],
                          ...checked.slice(index + 1),
                        ]);
                    }}
                  />
                </Box>
              )}
              {row.map((cell, index2) => (
                <Col key={index2} xs={12} sm={6}>
                  {cell}
                </Col>
              ))}
            </Stack>
          </Box>
        </Row>
      ))}
    </Stack>
  </Box>
);

export default Table;

export type { Props as TableProps };
