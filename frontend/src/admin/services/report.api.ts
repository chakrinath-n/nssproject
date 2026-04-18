import api from "@/api/axios";

export interface Report {
  id: number;
  report_id: string;
  name: string;
  description: string;
  file_url: string | null;
  created_at: string;
}

export const getReports = () => api.get("/reports");

export const createReport = (data: FormData) =>
  api.post("/reports", data);

export const deleteReport = (id: number) =>
  api.delete(`/reports/${id}`);