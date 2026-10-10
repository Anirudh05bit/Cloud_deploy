import api from "./api";

export async function getDeployments() {
  const response = await api.get("/api/deployments/");
  return response.data;
}

export async function getProjectDeployments(projectId) {
  const response = await api.get(
    `/api/projects/${projectId}/deployments/`
  );
  return response.data;
}

export async function createDeployment(projectId) {
  const response = await api.post(
    `/api/projects/${projectId}/deployments/`
  );
  return response.data;
}

export async function getDeploymentLogs(deploymentId) {
  const response = await api.get(
    `/api/deployments/${deploymentId}/logs/`
  );
  return response.data;
}
