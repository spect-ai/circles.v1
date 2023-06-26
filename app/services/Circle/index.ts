export const moveCircle = (
  destinationCircleId: string,
  circleIdBeingMoved: string
) => {
  return fetch(
    `${process.env.API_HOST}/circle/v2/slug/${circleIdBeingMoved}/move?destinationCircleId=${destinationCircleId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
};

export const duplicateCircle = (
  sourceCircleSlug: string,
  circleIdBeingDuplicated: string,
  duplicateAutomations?: boolean,
  duplicateCollections?: boolean,
  duplicateMembership?: boolean,
  destinationCircleId?: string
) => {
  let urlQueryParams = "";
  if (destinationCircleId) {
    urlQueryParams = "&destinationCircleId=" + destinationCircleId;
  }
  if (duplicateAutomations !== undefined) {
    urlQueryParams = "&duplicateAutomations=" + duplicateAutomations;
  }
  if (duplicateCollections !== undefined) {
    urlQueryParams = "&duplicateCollections=" + duplicateCollections;
  }
  if (duplicateMembership !== undefined) {
    urlQueryParams = "&duplicateMembership=" + duplicateMembership;
  }
  return fetch(
    `${process.env.API_HOST}/circle/v2/slug/${sourceCircleSlug}/duplicate?circleIdBeingDuplicated=${circleIdBeingDuplicated}${urlQueryParams}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
};
