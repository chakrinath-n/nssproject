import { Request, Response } from "express";
import pool from "../config/db";

/* ================= ADD ACTIVITY ================= */

export const addActivity = async (req: Request, res: Response) => {
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

    const {
      activity_name, description, activity_type_id,
      event_date, end_date, volunteers_count, location,
    } = req.body;

    if (!activity_name || !description || !event_date) {
      return res.status(400).json({ message: "Name, description and date are required" });
    }

    // Photos from uploaded files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const photo1 = files?.photo1?.[0]?.filename || null;
    const photo2 = files?.photo2?.[0]?.filename || null;
    const photo3 = files?.photo3?.[0]?.filename || null;

    await pool.query(
      `INSERT INTO activities
        (activity_name, description, activity_type_id, event_date, end_date,
         volunteers_count, location, photo1, photo2, photo3, unit_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        activity_name, description, activity_type_id,
        event_date, end_date || null,
        volunteers_count || 0, location,
        photo1, photo2, photo3, unitId
      ]
    );

    res.json({ message: "Activity added successfully" });

  } catch (error) {
    console.error("Add Activity Error:", error);
    res.status(500).json({ message: "Failed to add activity" });
  }
};

/* ================= GET ACTIVITIES BY TYPE ================= */

export const getActivitiesByType = async (req: Request, res: Response) => {
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
    const { type_id } = req.params;

    const result = await pool.query(
      `SELECT a.*, at.name as activity_type_name
       FROM activities a
       LEFT JOIN activity_types at ON a.activity_type_id = at.id
       WHERE a.unit_id=$1 AND a.activity_type_id=$2
       ORDER BY a.event_date DESC`,
      [unitId, type_id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error("Get Activities By Type Error:", error);
    res.status(500).json({ message: "Failed to fetch activities" });
  }
};

/* ================= GET ALL ACTIVITIES ================= */

export const getAllActivities = async (req: Request, res: Response) => {
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
      `SELECT a.*, at.name as activity_type_name
       FROM activities a
       LEFT JOIN activity_types at ON a.activity_type_id = at.id
       WHERE a.unit_id=$1
       ORDER BY a.event_date DESC`,
      [unitId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error("Get All Activities Error:", error);
    res.status(500).json({ message: "Failed to fetch activities" });
  }
};

/* ================= DELETE ACTIVITY ================= */

export const deleteOfficerActivity = async (req: Request, res: Response) => {
  try {
    const officerId = (req as any).user?.id;
    if (!officerId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    await pool.query("DELETE FROM activities WHERE id=$1", [id]);

    res.json({ message: "Activity deleted successfully" });

  } catch (error) {
    console.error("Delete Activity Error:", error);
    res.status(500).json({ message: "Failed to delete activity" });
  }
};

/* ================= UPDATE ACTIVITY ================= */

export const updateOfficerActivity = async (req: Request, res: Response) => {
  try {
    const officerId = (req as any).user?.id;
    if (!officerId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const {
      activity_name, description, activity_type_id,
      event_date, end_date, volunteers_count, location,
    } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const photo1 = files?.photo1?.[0]?.filename || null;
    const photo2 = files?.photo2?.[0]?.filename || null;
    const photo3 = files?.photo3?.[0]?.filename || null;

    // Get existing photos if no new ones uploaded
    const existing = await pool.query(
      "SELECT photo1, photo2, photo3 FROM activities WHERE id=$1",
      [id]
    );
    const existingPhotos = existing.rows[0];

    await pool.query(
      `UPDATE activities SET
        activity_name=$1, description=$2, activity_type_id=$3,
        event_date=$4, end_date=$5, volunteers_count=$6, location=$7,
        photo1=$8, photo2=$9, photo3=$10
       WHERE id=$11`,
      [
        activity_name, description, activity_type_id,
        event_date, end_date || null, volunteers_count, location,
        photo1 || existingPhotos.photo1,
        photo2 || existingPhotos.photo2,
        photo3 || existingPhotos.photo3,
        id
      ]
    );

    res.json({ message: "Activity updated successfully" });

  } catch (error) {
    console.error("Update Activity Error:", error);
    res.status(500).json({ message: "Failed to update activity" });
  }
};

/* ================= PUBLIC - GET ACTIVITIES BY UNIT CODE ================= */

export const getPublicActivitiesByUnit = async (req: Request, res: Response) => {
  try {
    const { unit_code } = req.params;
    const { year } = req.query;

    // Find unit by nss_unit_code
    const unitResult = await pool.query(
      "SELECT id, college_name, nss_unit_code FROM nss_units WHERE nss_unit_code=$1",
      [unit_code]
    );

    if (unitResult.rows.length === 0)
      return res.status(404).json({ message: "Unit not found" });

    const unit = unitResult.rows[0];

    let query = `
      SELECT a.*, at.name as activity_type_name,
             n.college_name, n.nss_unit_code
      FROM activities a
      LEFT JOIN activity_types at ON a.activity_type_id = at.id
      LEFT JOIN nss_units n ON a.unit_id = n.id
      WHERE a.unit_id=$1
    `;

    const params: any[] = [unit.id];

    if (year) {
      query += ` AND EXTRACT(YEAR FROM a.event_date) = $2`;
      params.push(year);
    }

    query += ` ORDER BY a.event_date DESC`;

    const result = await pool.query(query, params);

    res.json({
      unit,
      activities: result.rows,
    });

  } catch (error) {
    console.error("Public Activities Error:", error);
    res.status(500).json({ message: "Failed to fetch activities" });
  }
};

/* ================= PUBLIC - GET SINGLE ACTIVITY DETAIL ================= */

export const getPublicActivityDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT a.*, at.name as activity_type_name,
              n.college_name, n.nss_unit_code, n.district
       FROM activities a
       LEFT JOIN activity_types at ON a.activity_type_id = at.id
       LEFT JOIN nss_units n ON a.unit_id = n.id
       WHERE a.id=$1`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Activity not found" });

    res.json(result.rows[0]);

  } catch (error) {
    console.error("Activity Detail Error:", error);
    res.status(500).json({ message: "Failed to fetch activity" });
  }
};