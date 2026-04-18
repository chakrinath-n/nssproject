import api from "@/api/axios";

export interface ImageType {
  id: number;
  url: string;
  caption: string | null;
  section: string;
  category?: string | null; // ✅ NEW (only used for gallery)
  uploaded_at: string;
}

/* =========================
   GET ALL IMAGES
========================= */
export const getImages = () =>
  api.get<ImageType[]>("/images");

/* =========================
   GET SINGLE IMAGE
========================= */
export const getImageById = (id: number) =>
  api.get<ImageType>(`/images/${id}`);

/* =========================
   CREATE IMAGE (UPLOAD)
========================= */
export const createImage = (formData: FormData) =>
  api.post<ImageType>("/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

/* =========================
   UPDATE IMAGE
========================= */
export const updateImage = (
  id: number,
  data: {
    caption?: string;
    section?: string;
    category?: string | null; // ✅ FIXED — allow category
  }
) => api.put<ImageType>(`/images/${id}`, data);

/* =========================
   DELETE IMAGE
========================= */
export const deleteImage = (id: number) =>
  api.delete(`/images/${id}`);