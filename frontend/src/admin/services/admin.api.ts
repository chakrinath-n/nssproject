import api from "@/api/axios";

export interface Admin {
  id: number;
  name: string | null;
  email: string;
  role: string;
  created_at: string;
}

export const getAdmins = () => api.get<Admin[]>("/admins");

export const getAdminById = (id: number) => api.get<Admin>(`/admins/${id}`);

export const createAdmin = (data: {
  name?: string;
  email: string;
  password: string;
  role?: string;
}) => api.post<Admin>("/admins", data);

export const updateAdmin = (
  id: number,
  data: {
    name?: string;
    email: string;
    password?: string;
    role?: string;
  }
) => api.put<Admin>(`/admins/${id}`, data);

export const deleteAdmin = (id: number) => api.delete(`/admins/${id}`);
