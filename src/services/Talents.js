import { AxiosApi } from "./Api";

export const getTalents = async ({ filters = {}, page = 1, pageSize = 10 }) => {
  const params = new URLSearchParams({
    ...filters,
    page,
    page_size: pageSize,
  });
  const response = await AxiosApi.get(`user/jobseekers/all/?${params.toString()}`);
  return response.data;
};
export const getTalentById = async (id) => {
  const response = await AxiosApi.post(`user/jobseekers/get_talents/?id=${id}`, {
    headers: { "Content-Type": "application/json" },
  } );

  return response.data;
};

export const getBranches = async () => {
  const { data } = await AxiosApi.get("/user/branches"); // update endpoint as needed
  return data.results;
};

export const getTracks = async () => {
  const { data } = await AxiosApi.get("/user/tracks"); // update endpoint as needed
  return data.results;
};

