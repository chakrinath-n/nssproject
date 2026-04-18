import { Request, Response } from "express";
import pool from "../config/db";

/* ================= GET ALL ACTIVITY TYPES ================= */

export const getActivityTypes = async (req: Request, res: Response) => {
  try {

    const result = await pool.query(
      "SELECT * FROM activity_types ORDER BY id ASC"
    );

    res.json(result.rows);

  } catch (error) {
    console.error("Get Activity Types Error:", error);
    res.status(500).json({ message: "Failed to fetch activity types" });
  }
};

/* ================= ADD ACTIVITY TYPE ================= */

export const addActivityType = async (req: Request, res: Response) => {
  try {

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    await pool.query(
      "INSERT INTO activity_types (name) VALUES ($1)",
      [name]
    );

    res.json({ message: "Activity type added successfully" });

  } catch (error) {
    console.error("Add Activity Type Error:", error);
    res.status(500).json({ message: "Failed to add activity type" });
  }
};

/* ================= UPDATE ACTIVITY TYPE ================= */

export const updateActivityType = async (req: Request, res: Response) => {
  try {

    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    await pool.query(
      "UPDATE activity_types SET name=$1 WHERE id=$2",
      [name, id]
    );

    res.json({ message: "Activity type updated successfully" });

  } catch (error) {
    console.error("Update Activity Type Error:", error);
    res.status(500).json({ message: "Failed to update activity type" });
  }
};

/* ================= DELETE ACTIVITY TYPE ================= */

export const deleteActivityType = async (req: Request, res: Response) => {
  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM activity_types WHERE id=$1",
      [id]
    );

    res.json({ message: "Activity type deleted successfully" });

  } catch (error) {
    console.error("Delete Activity Type Error:", error);
    res.status(500).json({ message: "Failed to delete activity type" });
  }
};