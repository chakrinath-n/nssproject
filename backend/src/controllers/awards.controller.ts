import { Request, Response } from "express";
import pool from "../config/db";

/* ================= GET ALL AWARDS ================= */

export const getAwards = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM awards ORDER BY award_year DESC, award_type, id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get Awards Error:", error);
    res.status(500).json({ message: "Failed to fetch awards" });
  }
};

/* ================= ADD AWARD ================= */

export const addAward = async (req: Request, res: Response) => {
  try {
    const { award_year, award_type, recipient_name, college_name, district } = req.body;

    if (!award_year || !award_type || !recipient_name || !college_name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const photo = (req.file as Express.Multer.File)?.filename || null;

    await pool.query(
      `INSERT INTO awards (award_year, award_type, recipient_name, college_name, district, photo)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [award_year, award_type, recipient_name, college_name, district, photo]
    );

    res.json({ message: "Award added successfully" });
  } catch (error) {
    console.error("Add Award Error:", error);
    res.status(500).json({ message: "Failed to add award" });
  }
};

/* ================= UPDATE AWARD ================= */

export const updateAward = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { award_year, award_type, recipient_name, college_name, district } = req.body;

    const photo = (req.file as Express.Multer.File)?.filename || null;

    const existing = await pool.query("SELECT photo FROM awards WHERE id=$1", [id]);
    const oldPhoto = existing.rows[0]?.photo;

    await pool.query(
      `UPDATE awards SET
        award_year=$1, award_type=$2, recipient_name=$3,
        college_name=$4, district=$5, photo=$6
       WHERE id=$7`,
      [award_year, award_type, recipient_name, college_name, district,
       photo || oldPhoto, id]
    );

    res.json({ message: "Award updated successfully" });
  } catch (error) {
    console.error("Update Award Error:", error);
    res.status(500).json({ message: "Failed to update award" });
  }
};

/* ================= DELETE AWARD ================= */

export const deleteAward = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM awards WHERE id=$1", [id]);
    res.json({ message: "Award deleted successfully" });
  } catch (error) {
    console.error("Delete Award Error:", error);
    res.status(500).json({ message: "Failed to delete award" });
  }
};