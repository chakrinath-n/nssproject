import { Request, Response } from "express";
import pool from "../config/db";


// GET /api/images/:id
export const getImageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM images WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Failed to fetch image" });
  }
};

// GET /api/images
export const getImages = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM images ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: "Failed to fetch images" });
  }
};

// POST /api/images
export const createImage = async (req: Request, res: Response) => {
  try {
    const { caption, section, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const imageUrl = `/uploads/images/${req.file.filename}`;

    const result = await pool.query(
      `INSERT INTO images (url, caption, section, category)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [imageUrl, caption || null, section, category || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating image:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
};

// PUT /api/images/:id
export const updateImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { caption, section, category } = req.body;

    const result = await pool.query(
      `UPDATE images
       SET caption = $1,
           section = $2,
           category = $3
       WHERE id = $4
       RETURNING *`,
      [caption, section, category || null, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json({ message: "Failed to update image" });
  }
};

// DELETE /api/images/:id
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM images WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Failed to delete image" });
  }
};