import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import useCardService from "@/app/services/Card/useCardService";
import { CardType } from "@/app/types";
import { UserAddOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";

export default function AssignToMe() {
  const { updateCard } = useCardService();
  const { connectedUser } = useGlobal();
  const { card, setCard, fetchCardActions } = useLocalCard();
  const [loading, setLoading] = useState(false);
  return (
    <PrimaryButton
      loading={loading}
      icon={<UserAddOutlined style={{ fontSize: "1.3rem" }} />}
      onClick={async () => {
        setLoading(true);
        if (card) {
          const data = await updateCard(
            {
              assignee: [...card.assignee, connectedUser],
            },
            card.id
          );
          setCard(data as CardType);
          void fetchCardActions();
        }
        setLoading(false);
      }}
    >
      {loading ? "Loading..." : "Assign to me"}
    </PrimaryButton>
  );
}
