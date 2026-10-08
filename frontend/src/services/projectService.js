import api from "./api";

export async function getProjects() {
  const { data } = await api.get("/api/projects/");
  return data;
}