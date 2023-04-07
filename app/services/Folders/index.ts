interface CreateFolderDto {
  name: string;
  avatar: string;
  contentIds?: string[];
}

interface UpdateFolderDto {
  name?: string;
  avatar?: string;
  contentIds?: string[];
}

interface UpdateFolderDetailsDto {
  folderDetails: {
    id: string;
    contentIds?: string[];
  }[];
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
    if (data.id) {
      return data;
    }
    return false;
  } catch (error) {
    console.warn(error);
    return false;
  }
};

export const updateFolder = async (
  updateFolderDto: UpdateFolderDto,
  circleId: string,
  folderId: string
) => {
  try {
    const res = await fetch(
      `${process.env.API_HOST}/circle/v1/${circleId}/folder/${folderId}/update`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateFolderDto),
        credentials: "include",
      }
    );
    const data = await res.json();
    if (data.id) {
      return data;
    }
    console.error("Error updating folders");
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteFolder = async (circleId: string, folderId: string) => {
  try {
    const res = await fetch(
      `${process.env.API_HOST}/circle/v1/${circleId}/folder/${folderId}/delete`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await res.json();
    if (data.id) {
      return data;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const updateFolderDetails = async (
  circleId: string,
  updateFolderDetailsDto: UpdateFolderDetailsDto
) => {
  try {
    const res = await fetch(
      `${process.env.API_HOST}/circle/v1/${circleId}/folderDetails`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateFolderDetailsDto),
        credentials: "include",
      }
    );
    const data = await res.json();
    if (data.id) {
      return data;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
