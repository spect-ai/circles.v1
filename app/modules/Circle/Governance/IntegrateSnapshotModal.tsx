import Modal from "@/app/common/components/Modal";
import { updateCircle } from "@/app/services/UpdateCircle";

import { useQuery as useApolloQuery, gql } from "@apollo/client";
import { Space } from "@/app/modules/Collection/VotingModule";
import { useState } from "react";
import { Box, Input, Text } from "degen";
import { useCircle } from "../CircleContext";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { toast } from "react-toastify";
import { logError } from "@/app/common/utils/utils";

type Props = {
  handleClose: () => void;
};

export default function IntegrateSnapshotModal({ handleClose }: Props) {
  const { circle, setCircleData } = useCircle();
  const [loading, setLoading] = useState(false);
  const [snapshotSpace, setSnapshotSpace] = useState(
    circle?.snapshot?.id || ""
  );
  const { loading: isLoading, data } = useApolloQuery(Space, {
    variables: { id: snapshotSpace },
  });
  const update = async () => {
    const res = await updateCircle(
      {
        snapshot: {
          name: data?.space?.name || "",
          id: snapshotSpace,
          network: data?.space?.network || "",
          symbol: data?.space?.symbol || "",
        },
      },
      circle?.id as string
    );
    if (res) {
      setCircleData(res);
      handleClose();
    } else logError("Error adding snapshot url");
  };

  return (
    <Modal
      handleClose={() => {
        handleClose();
      }}
      size="small"
      title="Integrate Snapshot"
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          padding: "2rem",
        }}
      >
        <Text variant="label">Enter your snapshot url</Text>
        <Input
          label
          hideLabel
          prefix="https://snapshot.org/#/"
          value={snapshotSpace}
          placeholder="your-space.eth"
          onChange={(e) => {
            setSnapshotSpace(e.target.value);
          }}
        />
        {snapshotSpace &&
          !isLoading &&
          (data?.space?.id ? (
            <Text size={"extraSmall"} color="accent">
              Snapshot Space - {data?.space?.name}
            </Text>
          ) : (
            <Text color={"red"}>Incorrect URL</Text>
          ))}
      </Box>
      <Box
        paddingRight="8"
        paddingBottom="8"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <PrimaryButton
          onClick={async () => {
            setLoading(true);
            await update();
            setLoading(false);
          }}
          disabled={!data?.space?.id}
          loading={loading}
        >
          Save
        </PrimaryButton>
      </Box>
    </Modal>
  );
}
