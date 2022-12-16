import { MemberDetails, PaymentDetails } from "@/app/types";
import { Box, useTheme, Text } from "degen";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import styled from "styled-components";

type Props = {
  index: number;
  paymentDetails: PaymentDetails;
  handleClick: (index: number) => void;
};

export default function PaymentCard({
  index,
  paymentDetails,
  handleClick,
}: Props) {
  const router = useRouter();
  const { mode } = useTheme();
  const { circle: cId } = router.query;
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );
  return (
    <Card mode={mode} key={index} onClick={() => handleClick(index)}>
      <Box
        display="flex"
        flexDirection={{
          xs: "column",
          md: "row",
        }}
        gap="4"
      >
        <Box
          display="flex"
          flexDirection="column"
          width={{
            xs: "full",
            md: "1/2",
          }}
          marginBottom={{
            xs: "0",
            md: "2",
          }}
        >
          <Text variant="extraLarge" weight="semiBold">
            {
              memberDetails?.memberDetails?.[paymentDetails.paidToUserId]
                ?.username
            }
          </Text>
        </Box>
      </Box>
    </Card>
  );
}

export const Card = styled(Box)<{ mode: string }>`
  display: flex;
  flex-direction: column;
  min-height: 12vh;
  margin-top: 1rem;
  padding: 0.4rem 1rem 0;
  border-radius: 0.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
    cursor: pointer;
  }
  position: relative;
  transition: all 0.3s ease-in-out;
  width: 80%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
