import { useLocalCard } from "@/app/modules/Project/CreateCardModal/hooks/LocalCardContext";
import { useEffect, useState } from "react";

export default function useCardDynamism() {
  const { cardType } = useLocalCard();

  const [activityTab, setActivityTab] = useState(0);
  const [submissionTab, setSubmissionTab] = useState(1);
  const [applicationTab, setApplicationTab] = useState(1);

  useEffect(() => {
    if (cardType === "Task") {
      setSubmissionTab(1);
    }
    if (cardType === "Bounty") {
      setSubmissionTab(2);
    }
  }, [cardType]);

  const getTabs = () => {
    if (cardType === "Task") {
      return ["Activity", "Submissions"];
    }
    if (cardType === "Bounty") {
      return ["Activity", "Applications", "Submissions"];
    }
    return ["Activity", "Submissions"];
  };
  return {
    getTabs,
    applicationTab,
    activityTab,
    submissionTab,
  };
}
