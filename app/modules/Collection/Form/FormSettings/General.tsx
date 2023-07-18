import { updateFormCollection } from "@/app/services/Collection";
import { Stack, Text, Textarea } from "degen";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import { AdditionalSettings } from "../AdditionalSettings";
import { Notifications } from "../Notifications";
import { logError } from "@/app/common/utils/utils";

export default function General() {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const [messageOnSubmission, setMessageOnSubmission] = useState("");

  useEffect(() => {
    setMessageOnSubmission(collection.formMetadata.messageOnSubmission);
  }, [collection.formMetadata.messageOnSubmission]);

  return (
    <Stack>
      <AdditionalSettings />
      <Notifications />
    </Stack>
  );
}
