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

  const canDo = (roles: string[]) => {
    if (!currentUser?.id) {
      return false;
    }
    const arr1 = circle?.memberRoles[currentUser?.id];
    const arr2 = roles;
    const filteredArray = arr1?.filter((value) => arr2.includes(value));
    return (filteredArray && filteredArray?.length > 0) || false;
    // return circle?.memberRoles[currentUser?.id]?.includes(roles) || false;
  };

  const canTakeAction = (action: string) => {
    const circleMembers = circle && Object.keys(circle?.memberRoles);
    if (!currentUser?.id) {
      return false;
    }
    switch (action) {
      case "cardType":
        return card?.creator === currentUser?.id;
      case "cardColumn":
        return (
          card?.reviewer.includes(currentUser?.id) ||
          card?.assignee.includes(currentUser?.id)
        );
      case "cardAssignee":
        return (
          card?.creator === currentUser?.id ||
          card?.reviewer.includes(currentUser?.id)
        );
      case "cardReviewer":
        return card?.creator === currentUser?.id;
      case "cardReward":
        return (
          card?.creator === currentUser?.id ||
          card?.reviewer.includes(currentUser?.id)
        );
      case "cardDelete":
        return card?.creator === currentUser?.id;
      case "cardDescription":
        return (
          card?.creator === currentUser?.id ||
          card?.reviewer.includes(currentUser?.id)
        );
      case "cardTitle":
        return (
          card?.creator === currentUser?.id ||
          card?.reviewer.includes(currentUser?.id)
        );
      case "cardLabels":
        return (
          card?.creator === currentUser?.id ||
          card?.reviewer.includes(currentUser?.id)
        );
      case "cardPriority":
        return (
          card?.creator === currentUser?.id ||
          card?.reviewer.includes(currentUser?.id)
        );
      case "cardComment":
        return circleMembers?.includes(currentUser?.id) || false;
      case "cardSubmission":
        return card?.assignee.includes(currentUser?.id);
      case "cardRevision":
        return (
          card?.creator === currentUser?.id ||
          card?.reviewer.includes(currentUser?.id)
        );
      case "cardSubTask":
        return (
          card?.creator === currentUser?.id ||
          card?.reviewer.includes(currentUser?.id)
        );
      case "cardPayment":
        return (
          (card?.creator === currentUser?.id ||
            card?.reviewer.includes(currentUser?.id)) &&
          card.reward.value > 0
        );
      case "cardPopoverActions":
        return (
          card?.creator === currentUser?.id ||
          card?.reviewer.includes(currentUser?.id)
        );
      case "cardApply":
        return !(
          card?.creator === currentUser?.id ||
          card?.reviewer.includes(currentUser?.id)
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
      projectCard.reviewer.includes(currentUser?.id) ||
      projectCard.assignee.includes(currentUser?.id)
    );
  };

  return {
    canDo,
    canTakeAction,
    canMoveCard,
  };
}
