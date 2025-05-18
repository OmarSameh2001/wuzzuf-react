import { AxiosApi } from "./Api";

// Create Application
export const createApplication = async (applicationData) => {
  const response = await AxiosApi.post("applications/", applicationData);
  return response.data;
};

// Get All Applications
export const getAllApplications = async () => {
  try {
  const response = await AxiosApi.get("applications/",{
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
} catch (error) {
  console.error("Error fetching applications:", error);
  throw error;
}
  
  // return response.data;
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

export async function bulkUpdateApplicationStatus(applicationIds, status, fail = false) {
  try {
      const response = await AxiosApi.patch(
          'applications/bulk_update_status/',
          {
              application_ids: applicationIds,
              status: String(status),
              fail: fail
          },
          {
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
              }
          }
      );
      return response.data;
  } catch (error) {
      console.error('Error in bulkUpdateApplicationStatus:', error);
      throw error;
  }
}

export const updateApplicationAts = async (atsData) => {
  const response = await AxiosApi.post(`applications/update_status_by_ats/`, atsData);
  return response.data;
}

export const updateApplicationCsv = async (csvData) => {
  const response = await AxiosApi.post(`applications/update_status_by_csv/`, csvData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export const getMeetingsByJob = async (params) => {
  const response = await AxiosApi.get(`applications/meetings/?${params.toString()}`);
  return response.data;
}

export const setContract = async (id, data) => {
  const response = await AxiosApi.post(`applications/set_contract/?application=${id}`, data);
  return response.data;
}

export const getJobStatusByUser = async (userId) => {
  // console.log(userId)
  const response = await AxiosApi.get(`applications/job_status/?user_id=${userId}`);
  // console.log(response)
  return response.data;
}
