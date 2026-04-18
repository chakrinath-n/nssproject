import api from "@/api/axios";

/* ================= TYPE ================= */

export interface Activity {
  id: number;
  category: string;
  name: string;
  description: string;
  source: string; // "admin" | "officer"
  created_at: string;
}

/* ================= API CALLS ================= */

// ← Always fetch only admin activities in university admin panel
export const getActivities = () =>
  api.get<Activity[]>("/activities?source=admin");

export const getActivityById = (id: number) =>
  api.get<Activity>(`/activities/${id}`);

export const createActivity = (data: {
  category: string;
  name: string;
  description: string;
}) => api.post<Activity>("/activities", data);

export const updateActivity = (
  id: number,
  data: {
    category: string;
    name: string;
    description: string;
  }
) => api.put<Activity>(`/activities/${id}`, data);

export const deleteActivity = (id: number) =>
  api.delete(`/activities/${id}`);