export async function updateColumnDetails(
  projectId: string,
  columnId: string,
  body: any
) {
  const response = await fetch(
    `http://localhost:3000/project/${projectId}/column/${columnId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    }
  );
  const data = await response.json();
  if (data.id) {
    return data;
  } else {
    return false;
  }
}

export async function addColumn(projectId: string) {
  const response = await fetch(
    `http://localhost:3000/project/${projectId}/column/add`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  const data = await response.json();
  if (data.id) {
    return data;
  } else {
    return false;
  }
}

export async function deleteColumn(projectId: string, columnId: string) {
  const response = await fetch(
    `http://localhost:3000/project/${projectId}/column/${columnId}/delete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  const data = await response.json();
  if (data.id) {
    return data;
  } else {
    return false;
  }
}
