/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC } from "react";

import { Box } from "degen";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  isSelected: boolean;
  onClick: (item: any) => void;
  item: any;
}

export const Container = styled(Box)`
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
`;

const ModalOption: FC<Props> = ({
  isSelected,
  onClick,
  item,
  children,
}: Props) => (
  <Container
    borderBottomWidth="0.375"
    paddingY="3"
    paddingX="8"
    cursor="pointer"
    transitionDuration="700"
    display="flex"
    flexDirection="row"
    alignItems="center"
    backgroundColor={isSelected ? "accentSecondary" : "transparent"}
    onClick={() => {
      onClick(item);
    }}
  >
    {children}
  </Container>
);

export default ModalOption;

export type { Props as ModalOptionProps };
