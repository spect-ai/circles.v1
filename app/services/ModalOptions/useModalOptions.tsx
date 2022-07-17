import { labelsMapping } from "@/app/common/utils/constants";
import { useGlobal } from "@/app/context/globalContext";
import {
  cardTypes,
  priority,
} from "@/app/modules/Project/CreateCardModal/constants";
import { useLocalCard } from "@/app/modules/Project/CreateCardModal/hooks/LocalCardContext";
import { MemberDetails } from "@/app/types";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export default function useModalOptions() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: memberDetails, refetch } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );
  const { project } = useLocalCard();
  const { connectedUser } = useGlobal();

  const fetchMemberDetails = () => {
    void refetch();
  };

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
        return project?.columnOrder?.map((column: string) => ({
          name: project?.columnDetails[column].name,
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
          (member: any) => member.value !== connectedUser
        );
        tempArr?.unshift({
          name:
            (memberDetails &&
              memberDetails.memberDetails[connectedUser]?.username + " (me)") ||
            " (me)",
          avatar:
            (memberDetails &&
              memberDetails.memberDetails[connectedUser]?.avatar) ||
            "",
          value: connectedUser,
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
    fetchMemberDetails,
  };
}
