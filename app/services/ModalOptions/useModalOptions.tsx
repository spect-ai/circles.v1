import { MemberDetails } from "@/app/types";
import { useRouter } from "next/router";
import React from "react";
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

  const fetchMemberDetails = () => {
    refetch();
  };
  const getMemberDetails = React.useCallback(
    (id: string) => memberDetails?.memberDetails[id],
    [memberDetails]
  );

  const getMemberAvatars = React.useCallback(
    (members: string[]) =>
      members.map((member) => {
        const memberDeets = getMemberDetails(member);
        return {
          src: memberDeets?.avatar,
          label: memberDeets?.username || "",
          address: memberDeets?.ethAddress,
          id: member,
        };
      }),
    [getMemberDetails]
  );
  return {
    getMemberDetails,
    fetchMemberDetails,
    getMemberAvatars,
  };
}
