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

export default function Polling({
  options,
  setOptions,
  message,
  setMessage,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { localCollection: collection, setLocalCollection } =
    useLocalCollection();

  useEffect(() => {
    if (
      collection?.voting &&
      collection.voting.enabled &&
      collection.voting.options
    ) {
      setOptions(collection.voting.options);
      setMessage(collection.voting.message || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  return (
    <>
      <Box padding="8">
        <Stack>
          <Stack space="1">
            <Text variant="label">Message</Text>
            <Input
              label=""
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Stack>
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
