export async function getAllTemplates() {
  const res = await fetch(`${process.env.API_HOST}/templates/v1`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json();
}
