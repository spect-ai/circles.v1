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
import { useAtom } from "jotai";
import { connectedUserAtom } from "@/app/state/global";

export default function useRoleGate() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const [connectedUser, setConnectedUser] = useAtom(connectedUserAtom);

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
          circle.roles[role].permissions[roleAction as CardPermissions]
            ?.Task === true
        ) {
          return true;
        }
      }
    }
    return false;
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
    if (!userRoles) return false;
    switch (permission) {
      case "manageSettings":
        if (connectedUser == collection.creator) return true;
        if (collection?.permissions?.manageSettings?.length > 0) {
          for (const role of userRoles) {
            if (collection?.permissions?.manageSettings?.includes(role))
              return true;
          }
        }
        return false;

      case "updateResponsesManually":
        if (connectedUser == collection.creator) return true;
        if (collection?.permissions?.updateResponsesManually?.length > 0) {
          for (const role of userRoles) {
            if (
              collection?.permissions?.updateResponsesManually?.includes(role)
            )
              return true;
          }
        }
        return false;

      case "addComments":
        if (connectedUser == collection.creator) return true;
        if (collection?.permissions?.addComments?.length > 0) {
          for (const role of userRoles) {
            if (collection?.permissions?.addComments.includes(role))
              return true;
          }
        } else if (
          collection?.permissions?.addComments?.length == 0 &&
          circle?.members?.includes(connectedUser)
        ) {
          return true;
        }
        return false;

      case "viewResponses":
        if (connectedUser == collection.creator) return true;
        if (collection?.permissions?.viewResponses?.length > 0) {
          for (const role of userRoles) {
            if (collection?.permissions?.viewResponses?.includes(role))
              return true;
          }
        } else if (
          collection?.permissions?.viewResponses?.length == 0 &&
          circle?.members?.includes(connectedUser)
        ) {
          return true;
        }

        if (!collection.permissions) {
          if (userRoles.length > 0) {
            return true;
          }
        }

      case "addAndEditFields":
        if (connectedUser == collection.creator) return true;
        if (collection?.permissions?.addAndEditFields?.length > 0) {
          for (const role of userRoles) {
            if (collection?.permissions?.addAndEditFields?.includes(role))
              return true;
          }
        }
        return false;

      default:
        return false;
    }
  };

  return {
    canDo,
    canMoveCard,
    formActions,
  };
}
