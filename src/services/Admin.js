import { AxiosApi } from "./Api";
import axios from "axios";

export const getUnverifiedCompanies = async (page = 1, pageSize = 10, searchQuery = "") => {
  const token = localStorage.getItem('token');
  const response = await axios.get("http://localhost:8000/user/admin/company/", {
    params: {
      page: page,
      page_size: pageSize,
      search: searchQuery,
    },
    headers: {
      Authorization: `Token ${token}` // Add the token here
    }
  });
  return response.data;
};


export const verifyCompany = async (companyId) => {
    console.log(companyId);
  const response = await AxiosApi.patch(
    `user/admin/verify_company/?id=${companyId}`
  );
  return response.data;
};

// --- Itian Functions ---
export const getItians = async (page = 1, pageSize = 10, searchQuery = "") => {
  const token = localStorage.getItem('token');
    const response = await axios.get("http://localhost:8000/user/admin/itian/", {
      params: {
        page: page,
        page_size: pageSize,
        search: searchQuery,
      },
      headers: {
        Authorization: `Token ${token}` // Add the token here
      }
    });
    return response.data; // Expect { count, results }
  };
  
  export const createItianSingle = async ({ email, national_id }) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('national_id', national_id);
      const response = await AxiosApi.post("user/admin/create_itian/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
  };
  
  export const createItianBulk = async (file) => {
    console.log(file);
    const formData = new FormData();
    formData.append('file', file);
    console.log(formData);
  
    const response = await AxiosApi.post("user/admin/create_itian/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };
  
  
  export const deleteItian = async (itianId) => {
    const response = await AxiosApi.delete("user/admin/delete_itian/", {
      params: {
        id: itianId,
      },
    });
    return response.data;
  };