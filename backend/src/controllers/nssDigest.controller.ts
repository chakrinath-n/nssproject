import { Request, Response } from "express";
import pool from "../config/db";

export const getNssDigest = async (req: Request, res: Response) => {
  try {
    const { college_id } = req.query;

    let unitFilter = college_id ? `WHERE v.unit_id = ${college_id}` : "";
    let actFilter = college_id ? `WHERE a.unit_id = ${college_id}` : "";
    let campFilter = college_id ? `WHERE unit_id = ${college_id}` : "";

    // Volunteer stats
    const volunteerStats = await pool.query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN gender='Male' THEN 1 ELSE 0 END) as male,
        SUM(CASE WHEN gender='Female' THEN 1 ELSE 0 END) as female,
        SUM(CASE WHEN category='SC' THEN 1 ELSE 0 END) as sc,
        SUM(CASE WHEN category='ST' THEN 1 ELSE 0 END) as st,
        SUM(CASE WHEN category='BC' THEN 1 ELSE 0 END) as bc,
        SUM(CASE WHEN category='OC' THEN 1 ELSE 0 END) as oc
      FROM volunteers v ${unitFilter}
    `);

    // Activities by type
    const activityStats = await pool.query(`
      SELECT
        at.name as type_name,
        COUNT(*) as count,
        COALESCE(SUM(a.volunteers_count), 0) as total_volunteers
      FROM activities a
      LEFT JOIN activity_types at ON a.activity_type_id = at.id
      ${actFilter}
      GROUP BY at.name
      ORDER BY at.name
    `);

    // Total activities
    const totalActivities = await pool.query(`
      SELECT COUNT(*) as total FROM activities a ${actFilter}
    `);

    // Special camps
    const campStats = await pool.query(`
      SELECT
        COUNT(*) as total,
        COALESCE(SUM(male_volunteers), 0) as male,
        COALESCE(SUM(female_volunteers), 0) as female
      FROM special_camps ${campFilter}
    `);

    // Colleges list
    const colleges = await pool.query(`
      SELECT id, college_name, nss_unit_code
      FROM nss_units
      ORDER BY college_name
    `);

    res.json({
      volunteers: volunteerStats.rows[0],
      activities: activityStats.rows,
      totalActivities: Number(totalActivities.rows[0].total),
      camps: campStats.rows[0],
      colleges: colleges.rows,
    });

  } catch (error) {
    console.error("NSS Digest Error:", error);
    res.status(500).json({ message: "Failed to fetch NSS digest" });
  }
};