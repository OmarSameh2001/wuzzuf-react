import { AxiosApi } from "./api";

// Create Answer
export const createAnswer = async (answerData) => {
  const response = await AxiosApi.post("answers/", answerData);
  return response.data;
};

// Get Answer by ID
export const getAnswerById = async (id) => {
  const response = await AxiosApi.get(`answers/${id}/`);
  return response.data;
};

// Update Answer by ID
export const updateAnswer = async (id, updatedData) => {
  const response = await AxiosApi.put(`answers/${id}/`, updatedData);
  return response.data;
};

// Delete Answer by ID
export const deleteAnswer = async (id) => {
  await AxiosApi.delete(`answers/${id}/`);
};

