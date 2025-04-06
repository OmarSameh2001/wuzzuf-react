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
