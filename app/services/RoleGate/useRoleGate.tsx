import { useLocalCard } from "@/app/modules/Project/CreateCardModal/hooks/LocalCardContext";
import { CardType, CircleType, UserType } from "@/app/types";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export default function useRoleGate() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const { card } = useLocalCard();

  const canDo = (role: string) => {
    if (!currentUser?.id) {
      return false;
    }
    return circle?.memberRoles[currentUser?.id]?.includes(role) || false;
  };

  const canTakeAction = (action: string) => {
    const circleMembers = circle && Object.keys(circle?.memberRoles);
    if (!currentUser?.id) {
      return false;
    }
    if (circle?.memberRoles[currentUser?.id]?.includes("steward")) {
      return true;
    }
    switch (action) {
      case "cardType":
        return card?.creator === currentUser?.id;
      case "cardColumn":
        return (
          card?.reviewer[0] === currentUser?.id ||
          card?.assignee[0] === currentUser?.id
        );
      case "cardAssignee":
        return (
          card?.creator === currentUser?.id ||
          card?.reviewer[0] === currentUser?.id
        );
      case "cardReviewer":
        return card?.creator === currentUser?.id;
      case "cardReward":
        return (
          card?.creator === currentUser?.id ||
          card?.reviewer[0] === currentUser?.id
        );
      case "cardDelete":
        return card?.creator === currentUser?.id;
      case "cardDescription":
        return (
          card?.creator === currentUser?.id ||
          card?.reviewer[0] === currentUser?.id
        );
      case "cardTitle":
        return (
          card?.creator === currentUser?.id ||
          card?.reviewer[0] === currentUser?.id
        );
      case "cardLabels":
        return (
          card?.creator === currentUser?.id ||
          card?.reviewer[0] === currentUser?.id
        );
      case "cardPriority":
        return (
          card?.creator === currentUser?.id ||
          card?.reviewer[0] === currentUser?.id
        );
      case "cardComment":
        return circleMembers?.includes(currentUser?.id) || false;
      case "cardSubmission":
        return (
          card?.reviewer[0] === currentUser?.id ||
          card?.assignee[0] === currentUser?.id
        );
      default:
        return false;
    }
  };

  const canMoveCard = (projectCard: CardType) => {
    if (!currentUser?.id) {
      return false;
    }
    if (circle?.memberRoles[currentUser?.id]?.includes("steward")) {
      return true;
    }
    return (
      projectCard?.creator === currentUser?.id ||
      projectCard.reviewer[0] === currentUser?.id ||
      projectCard.assignee[0] === currentUser?.id
    );
  };

  return {
    canDo,
    canTakeAction,
    canMoveCard,
  };
}
