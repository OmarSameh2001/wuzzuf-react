import axios from "axios";
import { AxiosApi } from "./Api";

// Create Job
export const createJob = async (jobData) => {
  const response = await AxiosApi.post("jobs/", jobData);
  return response.data;
};

// Get Recommended Jobs
export const getRecommendedJobs = async (user_id) => {
  const response = await AxiosApi.get(`jobs/recomm/${user_id}/`);
  return response.data;
}

// Get All Jobs with Filters and Pagination
export const getAllJobs = async ({filters = {}, page = 1, pageSize = 10}) => {
  const params = new URLSearchParams({
    ...filters,
    page,
    page_size: pageSize,
  });
  const response = await AxiosApi.get(`jobs/?${params.toString()}`);
  return response;
};

// Get Job by ID
export const getJobById = async (id) => {
  const response = await AxiosApi.get(`jobs/${id}/`);
  return response.data;
};

// Update Job by ID
export const updateJob = async (id, updatedData) => {
  const response = await AxiosApi.put(`jobs/${id}/`, updatedData);
  return response.data;
};
export const patchJob = async (id, job) => {
  const response = await AxiosApi.patch(`jobs/${id}/`, job);
  return response.data;
}

// Delete Job by ID
export const deleteJob = async (id) => {
  await AxiosApi.delete(`jobs/${id}/`);
};

export const jobTalents = async (id, page = 1, rowsPerPage = 10) => {
  const response = await AxiosApi.get(`jobs/top_talents/${id}/?page_size=${rowsPerPage}&page=${page}`);
  return response.data;
}