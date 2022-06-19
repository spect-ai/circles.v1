import Modal from "@/app/common/components/Modal";
import { CircleType } from "@/app/types";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import Contributors from "../Contributors";

type Props = {
  handleClose: () => void;
};

export default function ContributorsModal({ handleClose }: Props) {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  return (
    <Modal title="Contributors" handleClose={handleClose} height="40rem">
      <Contributors
        members={circle?.members || []}
        memberDetails={circle?.memberDetails || {}}
        roles={circle?.memberRoles || {}}
      />
    </Modal>
  );
}
