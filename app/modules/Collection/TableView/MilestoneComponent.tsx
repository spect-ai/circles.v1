import { Box, Button, Text } from "degen";
import { CellProps } from "react-datasheet-grid";
import { useLocalCollection } from "../Context/LocalCollectionContext";

const MilestoneComponent = ({ rowData, columnData }: CellProps) => {
  const milestones = rowData[columnData.property.id] || [];
  const id = rowData.id;
  const { localCollection: collection, authorization } = useLocalCollection();

  return (
    <>
      <Box
        marginLeft="1"
        display="flex"
        flexDirection="row"
        alignItems="center"
        width="full"
      >
        <Button
          variant="transparent"
          width="full"
          justifyContent="flex-start"
          size="small"
          onClick={() => {
            if (
              collection.collectionType === 0
                ? columnData.isPartOfFormView
                : authorization === "readonly"
            )
              return;

            columnData.setPropertyId(columnData.property.id);
            columnData.setDataId(id);
            columnData.setMultipleMilestoneModalOpen(true);
          }}
        >
          {milestones && milestones.length > 0 ? (
            <Text variant="small">{`${milestones.length} milestone${
              milestones.length > 1 ? "s" : ""
            }`}</Text>
          ) : (
            <Text variant="small">{"No milestones"}</Text>
          )}
        </Button>
      </Box>
    </>
  );
};

export default MilestoneComponent;
