import { useGlobal } from "@/app/context/globalContext";
import { useLocalCard } from "@/app/modules/Project/CreateCardModal/hooks/LocalCardContext";
import { CardType, CircleType } from "@/app/types";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export default function useRoleGate() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { connectedUser } = useGlobal();

  const { card } = useLocalCard();
  const canDo = (roles: string[]) => {
    if (!connectedUser) {
      return false;
    }
    const arr1 = circle?.memberRoles[connectedUser];
    const arr2 = roles;
    const filteredArray =
      arr1?.filter && arr1?.filter((value) => arr2.includes(value));
    return (filteredArray && filteredArray?.length > 0) || false;
    // return circle?.memberRoles[connectedUser]?.includes(roles) || false;
  };

  const canTakeAction = (action: string) => {
    const circleMembers = circle && Object.keys(circle?.memberRoles);
    if (!connectedUser) {
      return false;
    }
    if (!card?.id) {
      return true;
    }
    switch (action) {
      case "cardType":
        return card?.creator === connectedUser;
      case "cardColumn":
        return (
          card?.reviewer.includes(connectedUser) ||
          card?.assignee.includes(connectedUser) ||
          card?.creator === connectedUser
        );
      case "cardDeadline":
        return (
          card?.reviewer.includes(connectedUser) ||
          card?.assignee.includes(connectedUser)
        );
      case "cardAssignee":
        return (
          card?.creator === connectedUser ||
          card?.reviewer.includes(connectedUser)
        );
      case "acceptApplication":
        return (
          (card?.creator === connectedUser ||
            card?.reviewer.includes(connectedUser)) &&
          card.assignee.length === 0
        );
      case "cardReviewer":
        return card?.creator === connectedUser;
      case "cardReward":
        return (
          card?.creator === connectedUser ||
          card?.reviewer.includes(connectedUser)
        );
      case "cardDelete":
        return card?.creator === connectedUser;
      case "cardDescription":
        return (
          card?.creator === connectedUser ||
          card?.reviewer.includes(connectedUser)
        );
      case "cardTitle":
        return (
          card?.creator === connectedUser ||
          card?.reviewer.includes(connectedUser)
        );
      case "cardLabels":
        return (
          card?.creator === connectedUser ||
          card?.reviewer.includes(connectedUser)
        );
      case "cardPriority":
        return (
          card?.creator === connectedUser ||
          card?.reviewer.includes(connectedUser)
        );
      case "cardComment":
        return circleMembers?.includes(connectedUser) || false;
      case "cardSubmission":
        return card?.assignee.includes(connectedUser);
      case "cardRevision":
        return (
          card?.creator === connectedUser ||
          card?.reviewer.includes(connectedUser)
        );
      case "cardSubTask":
        return (
          card?.creator === connectedUser ||
          card?.reviewer.includes(connectedUser)
        );
      case "cardPayment":
        return (
          (card?.creator === connectedUser ||
            card?.reviewer.includes(connectedUser)) &&
          card.reward.value > 0 &&
          card.assignee.length > 0 &&
          !card.status.paid
        );
      case "cardPopoverActions":
        return (
          card?.creator === connectedUser ||
          card?.reviewer.includes(connectedUser)
        );
      case "cardApply":
        return (
          !(
            card?.creator === connectedUser ||
            card?.reviewer.includes(connectedUser)
          ) &&
          card.assignee.length === 0 &&
          !card.myApplication
        );
      case "assignToMe":
        return (
          card.assignee.length === 0 && circleMembers?.includes(connectedUser)
        );
      default:
        return false;
    }
  };

  const canMoveCard = (projectCard: CardType) => {
    if (!connectedUser) {
      return false;
    }
    if (circle?.memberRoles[connectedUser]?.includes("steward")) {
      return true;
    }
    return (
      projectCard?.creator === connectedUser ||
      projectCard.reviewer.includes(connectedUser) ||
      projectCard.assignee.includes(connectedUser)
    );
  };

  return {
    canDo,
    canTakeAction,
    canMoveCard,
  };
}
