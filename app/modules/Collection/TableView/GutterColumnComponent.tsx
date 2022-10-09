import { ExpandAltOutlined } from "@ant-design/icons";
import { Box, Stack, Text } from "degen";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { CellProps } from "react-datasheet-grid";

export default function GutterColumnComponent({ rowIndex }: CellProps) {
  const [hover, setHover] = useState(false);
  const router = useRouter();
  const { circle: cId, collection: cUID } = router.query;
  return (
    <Box
      cursor="pointer"
      width="full"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => router.push(`/${cId}/r/${cUID}?row=${rowIndex}`)}
    >
      <Stack align="center">
        {!hover && <Text variant="label">{rowIndex + 1}</Text>}
        {hover && (
          <Text color="accent">
            <ExpandAltOutlined style={{ fontSize: "1.4rem" }} />
          </Text>
        )}
      </Stack>
    </Box>
  );
}
