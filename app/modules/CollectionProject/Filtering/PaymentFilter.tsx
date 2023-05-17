import Popover from "@/app/common/components/Popover";
import { IconEth, Stack, Tag, Text, Box, Button } from "degen";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { MenuContainer, MenuItem } from "../EditValue";

function PaymentFilter() {
  const { paymentFilter, setPaymentFilter } = useLocalCollection();
  const [isOpen, setIsOpen] = useState(false);

  const paymentOptions = ["none", "Paid", "Pending", "Pending Signature"];
  return (
    <Stack direction={"horizontal"} align={"center"}>
      <Popover
        width="fit"
        butttonComponent={
          <Button
            variant="transparent"
            size="extraSmall"
            onClick={() => setIsOpen(true)}
          >
            <Box display="flex" flexDirection="row" alignItems="center" gap="0">
              <Text variant="label">
                <IconEth
                  size={"5"}
                  color={paymentFilter === "none" ? "inherit" : "accent"}
                />
              </Text>
              <Text variant="label">
                {paymentFilter === "none" ? "Payment" : paymentFilter}
              </Text>
            </Box>
          </Button>
        }
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto", transition: { duration: 0.2 } }}
          exit={{ height: 0 }}
          style={{
            overflow: "hidden",
          }}
        >
          <Box backgroundColor="background">
            <MenuContainer borderRadius="2xLarge" cWidth="10rem">
              <Stack space="0">
                {paymentOptions.map((option: any) => (
                  <MenuItem
                    padding="2"
                    key={option}
                    onClick={() => {
                      setPaymentFilter(option);
                      setIsOpen(false);
                    }}
                  >
                    <Text>{option}</Text>
                  </MenuItem>
                ))}
              </Stack>
            </MenuContainer>
          </Box>
        </motion.div>
      </Popover>
    </Stack>
  );
}

export default PaymentFilter;
