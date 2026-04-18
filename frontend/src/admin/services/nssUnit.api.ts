import api from "@/api/axios";

/* ================= TYPE ================= */

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
  // New fields
  state: string | null;
  block: string | null;
  university_name: string | null;
  governing_body: string | null;
  courses_offered: string | null;
  college_type: string | null;
  college_address: string | null;
  college_phone: string | null;
  college_email: string | null;
  po_gender: string | null;
  po_mob_no: string | null;
  po_aadhaar: string | null;
  po_blood_group: string | null;
  po_teaching_subject: string | null;
  po_experience: string | null;
  po_eti_status: string | null;
}

/* ================= PAYLOAD TYPE ================= */

type NssUnitPayload = {
  district: string;
  nss_unit_code: string;
  college_code?: string;
  college_name: string;
  unit_type?: string;
  programme_officer?: string;
  officer_email: string;
  adopted_village?: string;
  // New fields
  state?: string;
  block?: string;
  university_name?: string;
  governing_body?: string;
  courses_offered?: string;
  college_type?: string;
  college_address?: string;
  college_phone?: string;
  college_email?: string;
  po_gender?: string;
  po_mob_no?: string;
  po_aadhaar?: string;
  po_blood_group?: string;
  po_teaching_subject?: string;
  po_experience?: string;
  po_eti_status?: string;
};

/* ================= API CALLS ================= */

export const getNssUnits = () =>
  api.get<NssUnit[]>("/nss-units");

export const getNssUnitById = (id: number) =>
  api.get<NssUnit>(`/nss-units/${id}`);

/* ================= CREATE ================= */

export const createNssUnit = (data: NssUnitPayload) =>
  api.post<NssUnit>("/nss-units", data);

/* ================= UPDATE ================= */

export const updateNssUnit = (id: number, data: NssUnitPayload) =>
  api.put<NssUnit>(`/nss-units/${id}`, data);

/* ================= DELETE ================= */

export const deleteNssUnit = (id: number) =>
  api.delete(`/nss-units/${id}`);