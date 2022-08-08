import { Box, IconCheck } from "degen";
import styled from "styled-components";

type Props = {
  isChecked: boolean;
  onClick?: () => void;
};

const Container = styled(Box)`
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  &:hover {
    cursor: pointer;
    border-color: rgb(191, 90, 242, 1);
  }
`;

export default function CheckBox({ isChecked, onClick }: Props) {
  return (
    <Container
      backgroundColor={isChecked ? "accentSecondary" : "transparent"}
      borderRadius="medium"
      borderWidth="0.375"
      paddingY="0"
      paddingX="1"
      fontWeight="medium"
      fontSize="small"
      display="flex"
      alignItems="center"
      width="fit"
      transitionDuration="300"
      onClick={onClick}
    >
      <IconCheck size="4" color={isChecked ? "accent" : "transparent"} />
    </Container>
  );
}
