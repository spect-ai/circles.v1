import { Box, Button, Text } from "degen";
import { useRouter } from "next/router";
import { CellProps } from "react-datasheet-grid";
import { Maximize2 } from "react-feather";

const GutterColumnComponent = ({ rowData }: CellProps) => {
  const router = useRouter();
  return (
    <Box cursor="pointer" width="full">
      <Button
        shape="circle"
        size="small"
        variant="transparent"
        onClick={() => {
          router.push({
            pathname: router.pathname,
            query: {
              circle: router.query.circle,
              collection: router.query.collection,
              cardSlug: rowData.id,
            },
          });
        }}
      >
        <Text color="accent">
          <Maximize2 size={19} />
        </Text>
      </Button>
    </Box>
  );
};

export default GutterColumnComponent;
