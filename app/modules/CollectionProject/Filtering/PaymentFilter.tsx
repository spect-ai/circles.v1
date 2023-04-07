import Popover from "@/app/common/components/Popover";
import { IconEth, Stack, Tag, Text, Box } from "degen";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { MenuContainer, MenuItem } from "../EditValue";

const PaymentFilter = () => {
  const { paymentFilter, setPaymentFilter } = useLocalCollection();
  const [isOpen, setIsOpen] = useState(false);

  const paymentOptions = ["none", "Paid", "Pending", "Pending Signature"];
  return (
    <Stack direction="horizontal" space="1" align="center">
      <IconEth size="5" color="accent" />
      <Popover
        width="fit"
        butttonComponent={
          <Box cursor="pointer" onClick={() => setIsOpen(true)}>
            <Tag hover tone={paymentFilter === "none" ? "secondary" : "accent"}>
              {paymentFilter}
            </Tag>
          </Box>
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
                {paymentOptions.map((option: string) => (
                  <MenuItem
                    padding="2"
                    key={option}
                    onClick={() => {
                      setPaymentFilter(
                        option as
                          | "none"
                          | "Paid"
                          | "Pending"
                          | "Pending Signature"
                      );
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
};

export default PaymentFilter;
