import { useGlobal } from "@/app/context/globalContext";
import { useLocalCard } from "@/app/modules/Project/CreateCardModal/hooks/LocalCardContext";
import { useLocalCollection } from "@/app/modules/Collection/Context/LocalCollectionContext";
import {
  CardPermissions,
  CardType,
  CircleType,
  NonCardPermissions,
  CollectionPermissions,
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
  const { localCollection: collection } = useLocalCollection();

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

  const formActions = (permission: CollectionPermissions) => {
    if (!connectedUser || !circle?.memberRoles) {
      return false;
    }
    const userRoles = circle?.memberRoles[connectedUser];
    switch (permission) {
      case "manageSettings":
        if (connectedUser == collection.creator) return true;
        if (collection?.permissions?.manageSettings.length > 0) {
          for (const role of userRoles) {
            if (collection?.permissions?.manageSettings.includes(role))
              return true;
          }
        }
        return false;

      case "updateResponsesManually":
        if (connectedUser == collection.creator) return true;
        if (collection?.permissions?.updateResponsesManually.length > 0) {
          for (const role of userRoles) {
            if (collection?.permissions?.updateResponsesManually.includes(role))
              return true;
          }
        }
        return false;

      case "addComments":
        if (connectedUser == collection.creator) return true;
        if (collection?.permissions?.addComments.length > 0) {
          for (const role of userRoles) {
            if (collection?.permissions?.addComments.includes(role))
              return true;
          }
        } else if (
          collection?.permissions?.addComments.length == 0 &&
          circle?.members?.includes(connectedUser)
        ) {
          return true;
        }
        return false;

      case "viewResponses":
        if (connectedUser == collection.creator) return true;
        if (collection?.permissions?.viewResponses.length > 0) {
          for (const role of userRoles) {
            if (collection?.permissions?.viewResponses.includes(role))
              return true;
          }
        } else if (
          collection?.permissions?.viewResponses.length == 0 &&
          circle?.members?.includes(connectedUser)
        ) {
          return true;
        }
        return false;

      default:
        return false;
    }
  };

  return {
    canDo,
    canTakeAction,
    canMoveCard,
    formActions,
  };
}
