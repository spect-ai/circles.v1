import { Option } from "@/app/types";
import { Box, Input, Stack, Text } from "degen";
import { SetStateAction } from "jotai";
import { useEffect, useState } from "react";
import AddOptions from "../AddField/AddOptions";
import { useLocalCollection } from "../Context/LocalCollectionContext";

type Props = {
  options: Option[];
  setOptions: (options: SetStateAction<Option[]>) => void;
  disabled?: boolean;
};

export default function SingleChoiceVotingOnSingleResponse({
  options,
  setOptions,
  disabled,
}: Props) {
  const [maxSelections, setMaxSelections] = useState<number>();
  const [allowCustom, setAllowCustom] = useState(true);
  return (
    <>
      <Box>
        <Stack>
          <Stack space="1">
            <AddOptions
              fieldOptions={options}
              setFieldOptions={setOptions}
              label="Voting Options"
              disabled={disabled}
              maxSelections={maxSelections}
              allowCustom={allowCustom}
              setAllowCustom={setAllowCustom}
              setMaxSelections={setMaxSelections}
            />
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
