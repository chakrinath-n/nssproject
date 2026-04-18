import { Request, Response } from "express";
import pool from "../config/db";

/* ================= GET ABOUT ================= */

export const getAbout = async (req: Request, res: Response) => {
  try {
    const aboutResult = await pool.query(
      "SELECT * FROM about LIMIT 1"
    );

    const teamResult = await pool.query(
      "SELECT * FROM about_team ORDER BY id ASC"
    );

    res.json({
      about: aboutResult.rows[0] || { title: "", content: "" },
      team: teamResult.rows,
    });
  } catch (error) {
    console.error("Get About Error:", error);
    res.status(500).json({ message: "Failed to fetch about data" });
  }
};

/* ================= UPDATE ABOUT ================= */

export const updateAbout = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    const existing = await pool.query("SELECT * FROM about");

    if (existing.rows.length === 0) {
      await pool.query(
        "INSERT INTO about (title, content) VALUES ($1, $2)",
        [title, content]
      );
    } else {
      await pool.query(
        "UPDATE about SET title=$1, content=$2 WHERE id=$3",
        [title, content, existing.rows[0].id]
      );
    }

    res.json({ message: "About updated" });
  } catch (error) {
    console.error("Update About Error:", error);
    res.status(500).json({ message: "Failed to update about" });
  }
};

/* ================= ADD TEAM MEMBER ================= */

export const addTeamMember = async (req: Request, res: Response) => {
  try {
    const { name, designation } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const imageUrl = `/uploads/about/${req.file.filename}`;

    await pool.query(
      "INSERT INTO about_team (name, designation, image_url) VALUES ($1,$2,$3)",
      [name, designation, imageUrl]
    );

    res.json({ message: "Member added" });
  } catch (error) {
    console.error("Add Team Error:", error);
    res.status(500).json({ message: "Failed to add member" });
  }
};

/* ================= DELETE TEAM MEMBER ================= */

export const deleteTeamMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM about_team WHERE id=$1",
      [id]
    );

    res.json({ message: "Member deleted" });
  } catch (error) {
    console.error("Delete Team Error:", error);
    res.status(500).json({ message: "Failed to delete member" });
  }
};