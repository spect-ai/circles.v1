import { Condition } from "@/app/types";
import { Box, Stack, Text } from "degen";
import { useState } from "react";
import AddConditions from "../Common/AddConditions";
import { useLocalCollection } from "../Context/LocalCollectionContext";

const MultiChoiceVotingOnMultipleResponses = () => {
  const { localCollection: collection } = useLocalCollection();
  const [conditions, setConditions] = useState<Condition[]>([]);

  return (
    <Box>
      <Stack>
        <Stack space="2">
          <Text variant="label">Filter Responses that are eligible</Text>
          <AddConditions
            viewConditions={conditions}
            setViewConditions={setConditions}
            firstRowMessage="Responses where"
            buttonText="Add Condition"
            collection={collection}
            dropDownPortal
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default MultiChoiceVotingOnMultipleResponses;
