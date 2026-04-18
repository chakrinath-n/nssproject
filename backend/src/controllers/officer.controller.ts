import { Request, Response } from "express";
import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ================= OFFICER LOGIN ================= */

export const officerLogin = async (req: Request, res: Response) => {
  try {

    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM program_officers WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const officer = result.rows[0];

    const validPassword = await bcrypt.compare(password, officer.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: officer.id,
        unit_id: officer.unit_id,
        role: "officer"
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      officer: {
        id: officer.id,
        name: officer.name,
        unit_id: officer.unit_id
      }
    });

  } catch (error) {

    console.error("Officer Login Error:", error);
    res.status(500).json({ message: "Login failed" });

  }
};


/* ================= CHANGE PASSWORD ================= */

export const changePassword = async (req: Request, res: Response) => {

  try {

    const officerId = (req as any).user?.id;

    if (!officerId) {
      return res.status(401).json({ message: "Unauthorized officer" });
    }

    const { oldPassword, newPassword } = req.body;

    const result = await pool.query(
      "SELECT password FROM program_officers WHERE id=$1",
      [officerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Officer not found" });
    }

    const officer = result.rows[0];

    const valid = await bcrypt.compare(oldPassword, officer.password);

    if (!valid) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE program_officers SET password=$1 WHERE id=$2",
      [hashedPassword, officerId]
    );

    res.json({ message: "Password updated successfully" });

  } catch (error) {

    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Failed to change password" });

  }

};


/* ================= OFFICER DASHBOARD ================= */

export const officerDashboard = async (req: Request, res: Response) => {
  try {
    const officerId = (req as any).user?.id;
    if (!officerId) return res.status(401).json({ message: "Unauthorized officer" });

    // ✅ Get all officer + unit + PO details + profile image
    const officerResult = await pool.query(
      `SELECT p.name, p.email, p.phone, p.unit_id,
              p.gender, p.aadhaar, p.blood_group,
              p.teaching_subject, p.experience, p.eti_status,
              n.nss_unit_code, n.college_name, n.district, n.unit_type,
              n.state, n.block, n.university_name, n.college_address,
              n.college_phone, n.college_email, n.adopted_village,
              s.profile_image
       FROM program_officers p
       LEFT JOIN nss_units n ON p.unit_id = n.id
       LEFT JOIN social_links s ON s.unit_id = p.unit_id
       WHERE p.id=$1`,
      [officerId]
    );

    if (officerResult.rows.length === 0)
      return res.status(404).json({ message: "Officer not found" });

    const officer = officerResult.rows[0];
    const unitId = officer.unit_id;

    const [activities, specialCamps, volunteers, recentActivities] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM activities WHERE unit_id=$1", [unitId]),
      pool.query("SELECT COUNT(*) FROM special_camps WHERE unit_id=$1", [unitId]),
      pool.query("SELECT COUNT(*) FROM volunteers WHERE unit_id=$1", [unitId]),
      pool.query(
        `SELECT a.activity_name, a.event_date, at.name as activity_type_name
         FROM activities a
         LEFT JOIN activity_types at ON a.activity_type_id = at.id
         WHERE a.unit_id=$1
         ORDER BY a.event_date DESC LIMIT 5`,
        [unitId]
      ),
    ]);

    res.json({
      officer: {
        name: officer.name,
        email: officer.email,
        phone: officer.phone,
        gender: officer.gender,
        aadhaar: officer.aadhaar,
        blood_group: officer.blood_group,
        teaching_subject: officer.teaching_subject,
        experience: officer.experience,
        eti_status: officer.eti_status,
        nss_unit_code: officer.nss_unit_code,
        college_name: officer.college_name,
        district: officer.district,
        unit_type: officer.unit_type,
        state: officer.state,
        block: officer.block,
        university_name: officer.university_name,
        college_address: officer.college_address,
        college_phone: officer.college_phone,
        college_email: officer.college_email,
        adopted_village: officer.adopted_village,
        profile_image: officer.profile_image,
      },
      totalActivities: Number(activities.rows[0].count),
      totalSpecialCamps: Number(specialCamps.rows[0].count),
      totalVolunteers: Number(volunteers.rows[0].count),
      recentActivities: recentActivities.rows,
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Dashboard error" });
  }
};
/* ================= CREATE ACTIVITY ================= */

export const createActivity = async (req: Request, res: Response) => {

  try {

    const officerId = (req as any).user?.id;

    if (!officerId) {
      return res.status(401).json({ message: "Unauthorized officer" });
    }

    const { activity_name, description, activity_type_id, event_date } = req.body;

    const officerResult = await pool.query(
      "SELECT unit_id FROM program_officers WHERE id=$1",
      [officerId]
    );

    if (officerResult.rows.length === 0) {
      return res.status(404).json({ message: "Officer not found" });
    }

    const unitId = officerResult.rows[0].unit_id;

    await pool.query(
      `INSERT INTO activities
      (activity_name, description, activity_type_id, event_date, unit_id)
      VALUES ($1,$2,$3,$4,$5)`,
      [activity_name, description, activity_type_id, event_date, unitId]
    );

    res.json({ message: "Activity created successfully" });

  } catch (error) {

    console.error("Create Activity Error:", error);
    res.status(500).json({ message: "Failed to create activity" });

  }

};

export const getEbsbVolunteers = async (req: Request, res: Response) => {

  const officerId = (req as any).user.id;

  const officer = await pool.query(
    "SELECT unit_id FROM program_officers WHERE id=$1",
    [officerId]
  );

  const unitId = officer.rows[0].unit_id;

  const volunteers = await pool.query(
    "SELECT * FROM volunteers WHERE unit_id=$1",
    [unitId]
  );

  res.json(volunteers.rows);

};

export const getPublicDashboard = async (req: Request, res: Response) => {
  try {
    const [units, volunteers, activities] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM nss_units"),
      pool.query("SELECT COUNT(*) FROM volunteers"),
      pool.query("SELECT COUNT(*) FROM activities"),
    ]);

    res.json({
      units: Number(units.rows[0].count),         // ✅ key is "units"
      volunteers: Number(volunteers.rows[0].count),
      activities: Number(activities.rows[0].count),
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Dashboard error" });
  }
};