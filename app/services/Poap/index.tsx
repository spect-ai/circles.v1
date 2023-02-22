type CreatePoapDto = {
  name: string;
  description: string;
  image: string;
  eventUrl: string;
  startDate: string;
  endDate: string;
  country: string;
  city: string;
  virtual: boolean;
  email: string;
  requestedCodes: number;
};

export const createPoap = async (
  collectionId: string,
  creatrePoapDto: CreatePoapDto
) => {
  const formData = new FormData();
  formData.append("name", creatrePoapDto.name);
  formData.append("description", creatrePoapDto.description);
  formData.append("file", creatrePoapDto.image);
  formData.append("eventUrl", creatrePoapDto.eventUrl);
  formData.append("startDate", creatrePoapDto.startDate);
  formData.append("endDate", creatrePoapDto.endDate);
  formData.append("country", creatrePoapDto.country);
  formData.append("city", creatrePoapDto.city);
  formData.append("virtual", creatrePoapDto.virtual.toString());
  formData.append("email", creatrePoapDto.email);
  formData.append("requestedCodes", creatrePoapDto.requestedCodes.toString());

  return await (
    await fetch(
      `${process.env.API_HOST}/collection/v1/${collectionId}/createPoap`,
      {
        method: "PATCH",
        credentials: "include",
        body: formData,
      }
    )
  ).json();
};

export const getPoap = async (poapId: string) => {
  return await (
    await fetch(`${process.env.API_HOST}/credentials/v1/poap/${poapId}`, {
      method: "GET",
      credentials: "include",
    })
  ).json();
};
