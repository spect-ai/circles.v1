import { Box, Button, Text } from "degen";
import { useRouter } from "next/router";
import { CellProps } from "react-datasheet-grid";
import { Maximize2 } from "react-feather";

export default function GutterColumnComponent({ rowData }: CellProps) {
  const router = useRouter();
  return (
    <Box cursor="pointer" width="full">
      <Button
        shape="circle"
        size="small"
        variant="transparent"
        onClick={() => {
          const query = {
            cardSlug: rowData.id,
          } as any;
          if (router.query.formId) {
            query["formId"] = router.query.formId;
          } else {
            if (router.query.circle) {
              query["circle"] = router.query.circle;
            }
            if (router.query.collection) {
              query["collection"] = router.query.collection;
            }
          }

          void router.push({
            pathname: router.pathname,
            query,
          });
        }}
      >
        <Text color="accent">
          <Maximize2 size={19} />
        </Text>
      </Button>
    </Box>
  );
}
