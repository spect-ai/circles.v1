import { Box, Button, Text } from "degen";
import React from "react";
import { CellProps } from "react-datasheet-grid";

const PaymentComponent = ({ rowData, columnData }: CellProps) => {
  const payment = rowData[columnData.property.name];
  const id = rowData.id;
  return (
    <Box
      marginLeft="1"
      display="flex"
      flexDirection="row"
      alignItems="center"
      width="full"
    >
      <Button
        variant="transparent"
        width="full"
        size="small"
        justifyContent="flex-start"
        onClick={() => {
          if (columnData.property.isPartOfFormView) return;
          columnData.setPropertyName(columnData.property.name);
          columnData.setDataId(id);
          columnData.setIsPaymentFieldOpen(true);
        }}
      >
        {payment?.txnHash ? (
          <Text variant="small">{`${payment.txnHash}`}</Text>
        ) : (
          <Text variant="small">{"Not Paid"}</Text>
        )}
      </Button>
    </Box>
  );
};

export default PaymentComponent;
