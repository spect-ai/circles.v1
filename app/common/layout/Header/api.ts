export const connectAccount = async (body: { token: string; data: string }) => {
  const res = await fetch("http://localhost:3000/users/connect", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  });

  return await res.json();
};

export const getUser = async () => {
  const token = localStorage.getItem("web3token") as string;
  if (!token) return null;
  const res = await fetch("http://localhost:3000/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
};
