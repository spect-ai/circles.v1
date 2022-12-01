import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { Action, CollectionType, Option } from "@/app/types";
import { Box, Input, Stack, Tag, Text } from "degen";
import { SetStateAction, useEffect, useState } from "react";

type Props = {
  actionMode: "edit" | "create";
  action: Action;
  setAction: (action: Action) => void;
};

export default function CreateCard({ setAction, actionMode, action }: Props) {
  const [collectionOptions, setCollectionOptions] = useState<Option[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Option>(
    {} as Option
  );
  const { circle } = useCircle();

  useEffect(() => {
    const fetchCollectionOptions = async () => {
      try {
        const data: CollectionType[] = await (
          await fetch(
            `${process.env.API_HOST}/circle/v1/${circle.id}/allActiveCollections`
          )
        ).json();
        setCollectionOptions(
          data.map((collection) => ({
            label: collection.name,
            value: collection.id,
          }))
        );
      } catch (e) {
        console.log(e);
      }
    };
    void fetchCollectionOptions();
  }, []);

  return (
    <Box
      marginTop="4"
      onMouseLeave={() => {
        setAction({
          ...action,
          data: {
            selectedCollection,
          },
        });
      }}
      width="full"
    >
      <Box marginBottom="2">
        <Text variant="label">Pick Collection</Text>
      </Box>
      <Dropdown
        options={collectionOptions}
        selected={selectedCollection}
        onChange={(value: SetStateAction<Option>) => {
          setSelectedCollection(value);
        }}
        multiple={false}
      />
    </Box>
  );
}
