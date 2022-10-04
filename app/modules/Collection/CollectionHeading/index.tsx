import { useGlobal } from "@/app/context/globalContext";
import { Box, Button, Stack, Text, useTheme } from "degen";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useLocalCollection } from "../Context/LocalCollectionContext";

export const IconButton = styled(Box)`
  cursor: pointer;
  &:hover {
    color: rgb(191, 90, 242, 1);
  }
`;

function CollectionHeading() {
  const { localCollection: collection, loading } = useLocalCollection();
  const { mode } = useTheme();
  const { setViewName, viewName } = useGlobal();

  const defaultView = () => {
    if (viewName.length > 0) setViewName("");
  };

  return (
    <Box
      width="full"
      display="flex"
      flexDirection="column"
      alignItems="center"
      // borderBottomWidth="0.375"
      paddingLeft="3"
      paddingRight="5"
    >
      <Box
        width="full"
        height="16"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        style={{
          paddingTop: "0.5rem",
          paddingBottom: "0.0rem",
        }}
      >
        <Stack direction="horizontal" align="center">
          {!loading && (
            <Button
              variant="transparent"
              size="small"
              onClick={() => defaultView()}
            >
              <Text size="headingTwo" weight="semiBold" ellipsis>
                {collection?.name}
              </Text>
            </Button>
          )}
          {loading && (
            <Skeleton
              enableAnimation
              style={{
                height: "2rem",
                width: "15rem",
                borderRadius: "0.5rem",
              }}
              baseColor={mode === "dark" ? "rgb(20,20,20)" : "rgb(255,255,255)"}
              highlightColor={
                mode === "dark" ? "rgb(255,255,255,0.1)" : "rgb(20,20,20,0.1)"
              }
            />
          )}
          {/* {collection?.name && <ProjectOptions />} */}
        </Stack>
      </Box>
    </Box>
  );
}

export default memo(CollectionHeading);
