import { useLocalCollection } from "@/app/modules/Collection/Context/LocalCollectionContext";
import {
  CircleType,
  CollectionPermissions,
  CollectionType,
  PermissionString,
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

  const canDo = (roleAction: PermissionString, circleToCheck?: CircleType) => {
    let localCircle = circle;
    if (circleToCheck?.memberRoles && circleToCheck?.roles) {
      localCircle = circleToCheck;
    }
    if (!connectedUser || !circle?.memberRoles) {
      return false;
    }
    const userRoles = localCircle?.memberRoles[connectedUser];
    if (userRoles) {
      for (const role of userRoles) {
        if (localCircle?.roles[role].permissions[roleAction] === true) {
          return true;
        }
      }
    }
    return false;
  };

  const formActions = (
    permission: CollectionPermissions,
    collectionToCheck?: CollectionType,
    circleContainingCollection?: CircleType
  ) => {
    let localCircle = circle;
    let localCollection = collection;
    if (
      circleContainingCollection?.memberRoles &&
      circleContainingCollection?.members &&
      collectionToCheck?.permissions
    ) {
      localCircle = circleContainingCollection;
      localCollection = collectionToCheck;
    }
    if (!connectedUser || !localCircle?.memberRoles) {
      return false;
    }
    const userRoles = localCircle?.memberRoles[connectedUser];
    if (!userRoles) return false;
    switch (permission) {
      case "manageSettings":
        if (connectedUser == localCollection.creator) return true;
        if (localCollection?.permissions?.manageSettings?.length > 0) {
          for (const role of userRoles) {
            if (localCollection?.permissions?.manageSettings?.includes(role))
              return true;
          }
        }
        return false;

      case "updateResponsesManually":
        if (connectedUser == localCollection.creator) return true;
        if (localCollection?.permissions?.updateResponsesManually?.length > 0) {
          for (const role of userRoles) {
            if (
              localCollection?.permissions?.updateResponsesManually?.includes(
                role
              )
            )
              return true;
          }
        }
        return false;

      case "addComments":
        if (connectedUser == localCollection.creator) return true;
        if (localCollection?.permissions?.addComments?.length > 0) {
          for (const role of userRoles) {
            if (localCollection?.permissions?.addComments.includes(role))
              return true;
          }
        } else if (
          localCollection?.permissions?.addComments?.length == 0 &&
          localCircle?.members?.includes(connectedUser)
        ) {
          return true;
        }
        return false;

      case "viewResponses":
        if (connectedUser == localCollection.creator) return true;
        if (localCollection?.permissions?.viewResponses?.length > 0) {
          for (const role of userRoles) {
            if (localCollection?.permissions?.viewResponses?.includes(role))
              return true;
          }
        } else if (
          localCollection?.permissions?.viewResponses?.length == 0 &&
          localCircle?.members?.includes(connectedUser)
        ) {
          return true;
        }

        if (!localCollection.permissions) {
          if (userRoles.length > 0) {
            return true;
          }
        }

      default:
        return false;
    }
  };

  return {
    canDo,
    formActions,
  };
}
