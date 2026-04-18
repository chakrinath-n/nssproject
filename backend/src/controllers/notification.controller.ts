import { Request, Response } from "express";
import pool from "../config/db";

/**
 * Extend Express Request to include multer file
 */
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

/* =========================
   PUBLIC: GET ACTIVE NOTIFICATIONS
========================= */
export const getPublicNotifications = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id,
              title,
              link,
              file,
              category,
              created_at
       FROM notifications
       WHERE is_active = true
       ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching public notifications:", error);
    res.status(500).json({ message: "Failed to fetch public notifications" });
  }
};

/* =========================
   ADMIN: GET ALL
========================= */
export const getNotifications = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notifications ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

/* =========================
   GET BY ID
========================= */
export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      "SELECT * FROM notifications WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({ message: "Failed to fetch notification" });
  }
};

/* =========================
   CREATE
========================= */
export const createNotification = async (req: Request, res: Response) => {
  try {
    const { title, link, category, is_scrolling, is_active } = req.body;

    const file = req.file?.filename || null;

    await pool.query(
      `INSERT INTO notifications 
       (title, link, category, is_scrolling, is_active, file)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [title, link, category, is_scrolling, is_active, file]
    );

    res.status(201).json({ message: "Created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* =========================
   UPDATE
========================= */
export const updateNotification = async (req: MulterRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existing = await pool.query(
      "SELECT file_url FROM notifications WHERE id=$1",
      [id]
    );

    if (existing.rowCount === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const {
      title,
      link,
      category,
      starts_at,
      ends_at,
      is_scrolling,
      is_active,
    } = req.body;

    // ✅ keep old file if no new file uploaded
    const file_url = req.file
      ? `/uploads/notifications/${req.file.filename}`
      : existing.rows[0].file_url;

    const result = await pool.query(
      `UPDATE notifications
       SET title=$1,
           link=$2,
           file_url=$3,
           category=$4,
           starts_at=$5,
           ends_at=$6,
           is_scrolling=$7,
           is_active=$8
       WHERE id=$9
       RETURNING *`,
      [
        title,
        link || null,
        file_url,
        category || null,
        starts_at || null,
        ends_at || null,
        is_scrolling ?? false,
        is_active ?? true,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: "Failed to update notification" });
  }
};

/* =========================
   DELETE
========================= */
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await pool.query("DELETE FROM notifications WHERE id=$1", [id]);

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};