export async function getAllTemplates() {
  const res = await fetch(`${process.env.API_HOST}/templates/v1`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json();
}

export async function useTemplate(
  templateId: string,
  destinationCircleId: string
) {
  console.log({
    templateId,
    destinationCircleId,
  });
  const res = await fetch(
    `${process.env.API_HOST}/templates/v1/${templateId}/use?destinationCircleId=${destinationCircleId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json();
}
