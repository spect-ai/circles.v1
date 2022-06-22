import { labelsMapping } from "@/app/common/utils/constants";
import {
  cardTypes,
  priority,
} from "@/app/modules/Project/CreateCardModal/constants";
import { useLocalCard } from "@/app/modules/Project/CreateCardModal/hooks/LocalCardContext";
import { MemberDetails, UserType } from "@/app/types";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export default function useModalOptions() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { project } = useLocalCard();
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const getOptions = (type: string) => {
    switch (type) {
      case "card":
        return cardTypes;
      case "priority":
        return priority;
      case "labels":
        return Object.keys(labelsMapping).map((label) => {
          return {
            name: label,
            value: label,
          };
        });
      case "column":
        return project.columnOrder?.map((column: string) => ({
          name: project.columnDetails[column].name,
          value: column,
        }));
      case "assignee":
        // eslint-disable-next-line no-case-declarations
        let tempArr = memberDetails?.members?.map((member: string) => ({
          name: memberDetails && memberDetails.memberDetails[member]?.username,
          avatar: memberDetails && memberDetails.memberDetails[member]?.avatar,
          value: member,
        }));
        tempArr = tempArr?.filter(
          (member: any) => member.value !== currentUser?.id
        );
        tempArr?.unshift({
          name:
            (memberDetails &&
              memberDetails.memberDetails[currentUser?.id as string]?.username +
                " (me)") ||
            " (me)",
          avatar:
            (memberDetails &&
              memberDetails.memberDetails[currentUser?.id as string]?.avatar) ||
            "",
          value: currentUser?.id || "",
        });
        tempArr?.unshift({
          name: "Unassigned",
          avatar: "",
          value: "",
        });

        return tempArr;
      default:
        return [];
    }
  };
  const getMemberDetails = (id: string) => {
    return memberDetails?.memberDetails[id];
  };
  return {
    getOptions,
    getMemberDetails,
  };
}
