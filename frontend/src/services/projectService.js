import api from "./api";

export async function getProjects() {
  const { data } = await api.get("/api/projects/");
  return data;
}

export async function createProject(project) {
  const { data } = await api.post("/api/projects/", project);
  return data;
}
export async function inspectProjectRepository(projectId) {
  const response = await api.get(
    `/api/projects/${projectId}/inspect-repository/`
  );

  return response.data;
}

export async function getProject(projectId) {
  const response = await api.get(`/api/projects/${projectId}`);
  return response.data;
}

export async function getProjectDeployments(projectId) {
  const response = await api.get(
    `/api/projects/${projectId}/deployments/`
  );
  return response.data;
}
