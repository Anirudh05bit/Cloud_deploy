import api from "./api";

export async function getProjects() {
  const { data } = await api.get("/api/projects/");
  return data;
}

export async function createProject(project) {
  const { data } = await api.post("/api/projects/", project);
  return data;
}