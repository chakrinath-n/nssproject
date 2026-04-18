import api from "@/api/axios";

export interface Notification {
  id: number;
  title: string;
  link: string | null;
  file_url?: string | null;   // ✅ NEW (uploaded file path)
  category: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_scrolling: boolean;
  is_active: boolean;
  created_at: string;
}

/* =========================
   GET
========================= */
export const getNotifications = () =>
  api.get<Notification[]>("/notifications");

export const getNotificationById = (id: number) =>
  api.get<Notification>(`/notifications/${id}`);

/* =========================
   CREATE (now supports file upload)
========================= */
export const createNotification = (formData: FormData) =>
  api.post<Notification>("/notifications", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* =========================
   UPDATE (now supports file upload)
========================= */
export const updateNotification = (id: number, formData: FormData) =>
  api.put<Notification>(`/notifications/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* =========================
   DELETE
========================= */
export const deleteNotification = (id: number) =>
  api.delete(`/notifications/${id}`);