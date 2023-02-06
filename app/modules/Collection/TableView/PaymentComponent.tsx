import { Box, Button, Text } from "degen";
import React from "react";
import { CellProps } from "react-datasheet-grid";
import { useCircle } from "../../Circle/CircleContext";

const PaymentComponent = ({ rowData, columnData }: CellProps) => {
  const payment = rowData[columnData.property.name];
  const { registry } = useCircle();
  return (
    <Box
      marginLeft="1"
      display="flex"
      flexDirection="row"
      alignItems="center"
      width="full"
    >
      <a
        href={`${registry?.[payment[0].chain.value].blockExplorer}tx/${
          payment[0].txnHash
        }`}
        target="_blank"
        rel="noreferrer"
        style={{ width: "100%" }}
      >
        <Button
          variant="transparent"
          width="full"
          size="small"
          justifyContent="flex-start"
        >
          {payment?.length > 0 ? (
            <Text variant="small">
              Paid {payment[0].value} {payment[0].token.label}
            </Text>
          ) : (
            <Text variant="small">{"Unpaid"}</Text>
          )}
        </Button>
      </a>
    </Box>
  );
};

export default PaymentComponent;
