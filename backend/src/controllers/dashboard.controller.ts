import { Request, Response } from "express";
import pool from "../config/db";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const units = await pool.query("SELECT COUNT(*) FROM nss_units");
    const activities = await pool.query("SELECT COUNT(*) FROM activities");
    const reports = await pool.query("SELECT COUNT(*) FROM reports");
    const admins = await pool.query("SELECT COUNT(*) FROM admins");

    res.status(200).json({
      volunteers: 12480,
      officers: 684,
      nssUnits: Number(units.rows[0].count),
      activities: Number(activities.rows[0].count),
      reports: Number(reports.rows[0].count),
      admins: Number(admins.rows[0].count),
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Dashboard stats error" });
  }
};


