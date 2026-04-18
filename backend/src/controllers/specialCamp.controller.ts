import { Request, Response } from "express";
import pool from "../config/db";

/* ================= ADD SPECIAL CAMP ================= */

export const addSpecialCamp = async (req: Request, res: Response) => {
  try {
    const officerId = (req as any).user?.id;
    if (!officerId) return res.status(401).json({ message: "Unauthorized" });

    // ✅ Step 1: get unit_id
    const officerResult = await pool.query(
      "SELECT unit_id FROM program_officers WHERE id=$1",
      [officerId]
    );
    if (officerResult.rows.length === 0)
      return res.status(404).json({ message: "Officer not found" });

    const unitId = officerResult.rows[0].unit_id;

    // ✅ Step 2: get unit info with correct column name
    const unitResult = await pool.query(
      "SELECT unit_type FROM nss_units WHERE id=$1",
      [unitId]
    );
    const nssUnitCode = unitResult.rows[0]?.unit_type || String(unitId);

    const {
      title,
      event_start_date,
      event_end_date,
      male_volunteers,
      female_volunteers,
      description,
    } = req.body;

    if (!title || !event_start_date || !event_end_date) {
      return res.status(400).json({ message: "Title and dates are required" });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const photo1 = files?.photo1?.[0]?.filename || null;
    const photo2 = files?.photo2?.[0]?.filename || null;
    const photo3 = files?.photo3?.[0]?.filename || null;
    const photo4 = files?.photo4?.[0]?.filename || null;
    const news_clipping1 = files?.news_clipping1?.[0]?.filename || null;
    const news_clipping2 = files?.news_clipping2?.[0]?.filename || null;

    await pool.query(
      `INSERT INTO special_camps (
        nss_unit_code, title, event_start_date, event_end_date,
        male_volunteers, female_volunteers, description,
        photo1, photo2, photo3, photo4,
        news_clipping1, news_clipping2, unit_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        nssUnitCode, title, event_start_date, event_end_date,
        male_volunteers || 0, female_volunteers || 0, description,
        photo1, photo2, photo3, photo4,
        news_clipping1, news_clipping2, unitId
      ]
    );

    res.json({ message: "Special camp report submitted successfully" });

  } catch (error) {
    console.error("Add Special Camp Error:", error);
    res.status(500).json({ message: "Failed to submit report" });
  }
};

/* ================= GET SPECIAL CAMPS ================= */

export const getSpecialCamps = async (req: Request, res: Response) => {
  try {
    const officerId = (req as any).user?.id;
    if (!officerId) return res.status(401).json({ message: "Unauthorized" });

    const officerResult = await pool.query(
      "SELECT unit_id FROM program_officers WHERE id=$1",
      [officerId]
    );
    if (officerResult.rows.length === 0)
      return res.status(404).json({ message: "Officer not found" });

    const unitId = officerResult.rows[0].unit_id;

    const result = await pool.query(
      "SELECT * FROM special_camps WHERE unit_id=$1 ORDER BY created_at DESC",
      [unitId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error("Get Special Camps Error:", error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

/* ================= DELETE SPECIAL CAMP ================= */

export const deleteSpecialCamp = async (req: Request, res: Response) => {
  try {
    const officerId = (req as any).user?.id;
    if (!officerId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    await pool.query("DELETE FROM special_camps WHERE id=$1", [id]);

    res.json({ message: "Report deleted successfully" });

  } catch (error) {
    console.error("Delete Special Camp Error:", error);
    res.status(500).json({ message: "Failed to delete report" });
  }
};