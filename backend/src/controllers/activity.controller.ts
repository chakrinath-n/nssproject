import { Request, Response } from "express";
import pool from "../config/db";

/* ================= GET ALL ACTIVITIES ================= */
export const getActivities = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { source } = req.query;

    let query = `
      SELECT 
        id,
        activity_name AS name,
        description,
        activity_type AS category,
        source,
        created_at
      FROM activities
    `;

    const params: any[] = [];

    if (source) {
      params.push(source);
      query += ` WHERE source = $1`;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Get Activities Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ACTIVITY BY ID ================= */
export const getActivityById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        id,
        activity_name AS name,
        description,
        activity_type AS category,
        source,
        created_at
       FROM activities 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Activity not found" });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get Activity Error:", error);
    res.status(500).json({ message: "Failed to fetch activity" });
  }
};

/* ================= CREATE ACTIVITY (Admin only) ================= */
export const createActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, category } = req.body;

    if (!name || !description) {
      res.status(400).json({
        message: "Activity name and description are required",
      });
      return;
    }

    const result = await pool.query(
      `INSERT INTO activities 
       (activity_name, description, activity_type, source)
       VALUES ($1, $2, $3, 'admin')
       RETURNING 
         id,
         activity_name AS name,
         description,
         activity_type AS category,
         source,
         created_at`,
      [name, description, category]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create Activity Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE ACTIVITY ================= */
export const updateActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, category } = req.body;

    if (!name || !description) {
      res.status(400).json({
        message: "Name and description are required",
      });
      return;
    }

    const result = await pool.query(
      `UPDATE activities
       SET activity_name = $1,
           description = $2,
           activity_type = $3
       WHERE id = $4 AND source = 'admin'
       RETURNING 
         id,
         activity_name AS name,
         description,
         activity_type AS category,
         source,
         created_at`,
      [name, description, category, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Activity not found or not editable" });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update Activity Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE ACTIVITY ================= */
export const deleteActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM activities 
       WHERE id = $1 AND source = 'admin'
       RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Activity not found or not deletable" });
      return;
    }

    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Delete Activity Error:", error);
    res.status(500).json({ message: "Failed to delete activity" });
  }
};