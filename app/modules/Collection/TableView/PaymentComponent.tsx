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
      {payment ? (
        <a
          href={`${registry?.[payment.chain.value].blockExplorer}tx/${
            payment.txnHash
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
            <Text variant="small">
              Paid {payment.value} {payment.token.label}
            </Text>
          </Button>
        </a>
      ) : (
        <Button
          variant="transparent"
          width="full"
          size="small"
          justifyContent="flex-start"
        >
          <Text variant="small">Not Paid</Text>
        </Button>
      )}
    </Box>
  );
};

export default PaymentComponent;
