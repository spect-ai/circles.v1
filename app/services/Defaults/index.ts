const createDefaultProject = async (id: string) => {
  const res = await fetch(
    `${process.env.API_HOST}/collection/v1/${id}/defaultProject`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  return null;
};

export default createDefaultProject;
