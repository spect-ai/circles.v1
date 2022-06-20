import Modal from "@/app/common/components/Modal";
import { CircleType } from "@/app/types";
import { Box } from "degen";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import Contributors from "./Contributors";

type Props = {
  handleClose: () => void;
};

export default function ContributorsModal({ handleClose }: Props) {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  const circleMembers = circle?.members.map((member) => member.id);

  return (
    <Modal title="Contributors" handleClose={handleClose} height="40rem">
      <Box padding="6">
        <Contributors
          members={circleMembers || []}
          memberDetails={circle?.memberDetails || {}}
          roles={circle?.memberRoles || {}}
        />
      </Box>
    </Modal>
  );
}
