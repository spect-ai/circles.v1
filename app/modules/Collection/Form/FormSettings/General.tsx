import { updateFormCollection } from "@/app/services/Collection";
import { Stack, Text, Textarea } from "degen";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { AdditionalSettings } from "../AdditionalSettings";
import Notifications from "../Notifications";

const General = () => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const [messageOnSubmission, setMessageOnSubmission] = useState("");

  useEffect(() => {
    setMessageOnSubmission(collection.formMetadata.messageOnSubmission);
  }, [collection.formMetadata.messageOnSubmission]);

  return (
    <Stack>
      <Stack space="1">
        <Text variant="label">
          After the form is submitted, show the following message
        </Text>
        <Textarea
          width={{
            xs: "full",
            md: "2/3",
          }}
          label=""
          value={messageOnSubmission}
          rows={2}
          onChange={(e) => {
            setMessageOnSubmission(e.target.value);
          }}
          onBlur={async () => {
            const res = await updateFormCollection(collection.id, {
              formMetadata: {
                ...collection.formMetadata,
                messageOnSubmission,
              },
            });
            if (res.id) updateCollection(res);
            else toast.error("Something went wrong, refresh and try again");
          }}
        />
      </Stack>
      <AdditionalSettings />
      <Notifications />
    </Stack>
  );
};

export default General;
