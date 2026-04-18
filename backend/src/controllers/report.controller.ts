import { Request, Response } from "express";
import pool from "../config/db";

export const getReports = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM reports ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Fetch Reports Error:", error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

export const createReport = async (req: Request, res: Response) => {
  try {
    const { report_id, name, description, external_url } = req.body;

    if (!report_id || !name) {
      return res.status(400).json({
        message: "Report ID and Name are required",
      });
    }

    let fileUrl = null;

    // If file uploaded → use file
    if (req.file) {
      fileUrl = `/uploads/reports/${req.file.filename}`;
    }
    // Else if URL entered → use URL
    else if (external_url) {
      fileUrl = external_url;
    }

    const result = await pool.query(
      `INSERT INTO reports (report_id, name, description, file_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [report_id, name, description || null, fileUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("Create Report Error:", error);

    if (error.code === "23505") {
      return res.status(400).json({
        message: "Report ID already exists",
      });
    }

    res.status(500).json({ message: "Failed to create report" });
  }
};
export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM reports WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Delete Report Error:", error);
    res.status(500).json({ message: "Failed to delete report" });
  }
};