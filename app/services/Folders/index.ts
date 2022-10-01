interface CreateFolderDto {
  name: string;
  avatar: string;
  contentIds?: string[];
}

export const createFolder = async (
  createFolderDto: CreateFolderDto,
  circleId: string
) => {
  try {
    const res = await fetch(
      `${process.env.API_HOST}/circle/v1/${circleId}/folder/add`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createFolderDto),
        credentials: "include",
      }
    );
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  }
};
