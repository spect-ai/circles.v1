import { Option } from "@/app/types";
import { Box, Input, Stack, Text } from "degen";
import { SetStateAction } from "jotai";
import { useEffect, useState } from "react";
import AddOptions from "../AddField/AddOptions";
import { useLocalCollection } from "../Context/LocalCollectionContext";

type Props = {
  options: Option[];
  setOptions: (options: SetStateAction<Option[]>) => void;
  message: string;
  setMessage: (message: string) => void;
};

export default function SingleChoiceVotingOnSingleResponse({
  options,
  setOptions,
}: Props) {
  return (
    <>
      <Box>
        <Stack>
          <Stack space="1">
            <AddOptions
              fieldOptions={options}
              setFieldOptions={setOptions}
              label="Voting Options"
            />
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
