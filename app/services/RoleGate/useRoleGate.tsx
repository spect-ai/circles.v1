import { useGlobal } from "@/app/context/globalContext";
import { useLocalCard } from "@/app/modules/Project/CreateCardModal/hooks/LocalCardContext";
import {
  CardPermissions,
  CardType,
  CircleType,
  NonCardPermissions,
} from "@/app/types";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export default function useRoleGate() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { connectedUser } = useGlobal();

  const { card, cardActions } = useLocalCard();

  const canDo = (roleAction: NonCardPermissions | CardPermissions) => {
    if (!connectedUser || !circle?.memberRoles) {
      return false;
    }
    const userRoles = circle?.memberRoles[connectedUser];
    if (userRoles) {
      for (const role of userRoles) {
        if (
          circle.roles[role].permissions[roleAction as NonCardPermissions] ===
            true ||
          circle.roles[role].permissions[roleAction as CardPermissions].Task ===
            true
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const canTakeAction = (action: string) => {
    const circleMembers = circle && Object.keys(circle?.memberRoles);
    if (!card?.id) {
      return true;
    }
    if (!connectedUser || !cardActions?.updateColumn) {
      return false;
    }

    switch (action) {
      case "cardType":
        return cardActions.updateGeneralCardInfo.valid;
      case "cardColumn":
        return cardActions.updateColumn.valid;
      case "cardDeadline":
        return cardActions.updateDeadline.valid;
      case "cardStartDate":
        return cardActions.updateStartDate.valid;
      case "cardAssignee":
        return cardActions.updateAssignee.valid;
      case "acceptApplication":
        return (
          (card?.creator === connectedUser ||
            card?.reviewer.includes(connectedUser)) &&
          card.assignee.length === 0
        );
      case "cardReviewer":
        return cardActions.updateGeneralCardInfo.valid;
      case "cardReward":
        return cardActions.updateGeneralCardInfo.valid;
      case "cardDelete":
        return cardActions.updateGeneralCardInfo.valid;
      case "cardDescription":
        return cardActions.updateGeneralCardInfo.valid;

      case "cardTitle":
        return cardActions.updateGeneralCardInfo.valid;

      case "cardLabels":
        return cardActions.updateGeneralCardInfo.valid;

      case "cardPriority":
        return cardActions.updateGeneralCardInfo.valid;

      case "cardComment":
        return circleMembers?.includes(connectedUser) || false;
      case "cardSubmission":
        return cardActions.submit.valid;
      case "cardRevision":
        return cardActions.addRevisionInstruction.valid;
      case "cardSubTask":
        return cardActions.updateGeneralCardInfo.valid;
      case "cardPayment":
        return cardActions.pay.valid;
      case "cardPopoverActions":
        return cardActions.archive.valid;
      case "cardApply":
        return cardActions.applyToBounty.valid;
      case "assignToMe":
        return cardActions.claim.valid;
      default:
        return false;
    }
  };

  const canMoveCard = (projectCard: CardType) => {
    if (!connectedUser) {
      return false;
    }
    const userRoles = circle?.memberRoles[connectedUser];
    if (userRoles) {
      for (const role of userRoles) {
        if (circle.roles[role].permissions.manageCardProperties) {
          return true;
        }
      }
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
