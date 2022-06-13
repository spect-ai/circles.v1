import { Box, Heading, Spinner } from "degen";
import React from "react";
import Backdrop from "../Modal/backdrop";

type Props = {
  loading: boolean;
  text: string;
};

function Loader({ loading, text }: Props) {
  if (!loading) return null;

  return (
    <Backdrop zIndex={11}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="full"
        height="full"
      >
        <Spinner size="large" color="accent" />
        <Heading>{text}</Heading>
      </Box>
    </Backdrop>
  );
}

export default Loader;

export type { Props as LoaderProps };
