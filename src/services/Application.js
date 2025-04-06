import { AxiosApi } from "./Api";

// Create Application
export const createApplication = async (applicationData) => {
  const response = await AxiosApi.post("applications/", applicationData);
  return response.data;
};

// Get All Applications
export const getAllApplications = async () => {
  const response = await AxiosApi.get("applications/");
  return response.data;
};

// Get Applications by User ID
export const getApplicationsByUser = async ({ filters = {}, page = 1, pageSize = 10 }) => {
  const params = new URLSearchParams({
    ...filters,
    page,
    page_size: pageSize,
  });
  const response = await AxiosApi.get(`applications/?${params.toString()}`);
  return response.data;
};

// Get Application by ID
export const getApplicationById = async (id) => {
  const response = await AxiosApi.get(`applications/${id}/`);
  return response.data;
};

// Update Application by ID
export const updateApplication = async (id, updatedData) => {
  const response = await AxiosApi.put(`applications/${id}/`, updatedData);
  return response.data;
};

// Delete Application by ID
export const deleteApplication = async (id) => {
  await AxiosApi.delete(`/applications/${id}/`);
};

// Patch Application by ID
export const patchApplication = async (id, patchData) => {
  const response = await AxiosApi.patch(`applications/${id}/`, patchData);
  return response.data;
};

