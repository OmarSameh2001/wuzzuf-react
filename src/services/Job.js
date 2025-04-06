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
  // console.log(filters)
  const response = await AxiosApi.get(`jobs/?${params.toString()}`);
  // console.log(response)
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

// Delete Job by ID
export const deleteJob = async (id) => {
  await AxiosApi.delete(`jobs/${id}/`);
};

