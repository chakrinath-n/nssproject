import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/* =======================
   TYPES
======================= */

export interface Image {
  id: number;
  url: string;
  caption: string | null;
  uploaded_at: string;
}

export interface Notification {
  id: number;
  title: string;
  link: string | null;
  file: string | null;      
  category: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_scrolling: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Page {
  id: number;
  menu_id: number | null;
  title: string;
  slug: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Menu {
  id: number;
  name: string;
  slug: string;
  position: number;
  is_active: boolean;
}

/* ✅ NEW TYPES */

export interface NssUnit {
  id: number;
  district: string;
  nss_unit_code: string;
  college_code: string | null;
  college_name: string;
  unit_type: string | null;
  programme_officer: string | null;
  officer_email: string | null;
  adopted_village: string | null;
  created_at: string;
}
export interface Report {
  id: number;
  report_id: string;
  name: string;
  description: string | null;
  file_url: string | null;
  created_at: string;
}


export interface Activity {
  id: number;
  activity_name: string;
  description: string;
  activity_type: string | null;
  created_at: string;
}
export interface Download {
  id: number;
  title: string;
  file_url: string;   // must match backend response
  is_active: boolean;
}


/* =======================
   API CALLS
======================= */

export const getImages = () => api.get<Image[]>("/images");
export const getNotifications = () => api.get<Notification[]>("/notifications");
export const getPages = () => api.get<Page[]>("/pages");
export const getPageBySlug = (slug: string) => api.get<Page>(`/pages/${slug}`);
export const getMenus = () => api.get<Menu[]>("/menus");

/* ✅ NEW API CALLS */

export const getNssUnits = () => api.get<NssUnit[]>("/nss-units");
export const getReports = () => api.get<Report[]>("/reports");
export const getActivities = () => api.get<Activity[]>("/activities");
export const getDownloads = () => api.get<Download[]>("/downloads");
