/* eslint-disable @typescript-eslint/no-explicit-any */
import { labels } from "@/app/common/utils/constants";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { connectedUserAtom } from "@/app/state/global";
import { MemberDetails } from "@/app/types";
import { useAtom } from "jotai";
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
  const { circle } = useCircle();
  const [connectedUser, setConnectedUser] = useAtom(connectedUserAtom);

  const fetchMemberDetails = () => {
    void refetch();
  };
  const getMemberDetails = React.useCallback(
    (id: string) => {
      return memberDetails?.memberDetails[id];
    },
    [memberDetails]
  );

  const getMemberAvatars = React.useCallback(
    (members: string[]) => {
      return members.map((member) => {
        const memberDetails = getMemberDetails(member);
        return {
          src: memberDetails?.avatar,
          label: memberDetails?.username || "",
          address: memberDetails?.ethAddress,
          id: member,
        };
      });
    },
    [getMemberDetails]
  );
  return {
    getMemberDetails,
    fetchMemberDetails,
    getMemberAvatars,
  };
}
