import { Option } from "@/app/types";
import { Box, Stack } from "degen";
import { SetStateAction } from "jotai";
import { useState } from "react";
import AddOptions from "../AddField/AddOptions";

type Props = {
  options: Option[];
  setOptions: (options: SetStateAction<Option[]>) => void;
  disabled?: boolean;
};

const SingleChoiceVotingOnSingleResponse = ({
  options,
  setOptions,
  disabled,
}: Props) => {
  const [maxSelections, setMaxSelections] = useState<number>();
  const [allowCustom, setAllowCustom] = useState(true);
  return (
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
  );
};

SingleChoiceVotingOnSingleResponse.defaultProps = {
  disabled: false,
};

export default SingleChoiceVotingOnSingleResponse;
