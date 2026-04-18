import { Request, Response } from "express";
import pool from "../config/db";

/* ================= GET SOCIAL LINKS ================= */

export const getSocialLinks = async (req: Request, res: Response) => {
  try {
    const officerId = (req as any).user?.id;
    if (!officerId) return res.status(401).json({ message: "Unauthorized" });

    const officerResult = await pool.query(
      `SELECT 
         p.name, p.phone, p.gender, p.aadhaar, p.blood_group,
         p.teaching_subject, p.experience, p.eti_status,
         p.unit_id,
         n.nss_unit_code, n.college_name, n.district, n.state,
         n.university_name, n.college_address, n.college_phone, n.college_email
       FROM program_officers p
       LEFT JOIN nss_units n ON p.unit_id = n.id
       WHERE p.id = $1`,
      [officerId]
    );

    if (officerResult.rows.length === 0)
      return res.status(404).json({ message: "Officer not found" });

    const officer = officerResult.rows[0];

    const linksResult = await pool.query(
      "SELECT * FROM social_links WHERE unit_id = $1",
      [officer.unit_id]
    );

    res.json({
      /* officer */
      officer_name:             officer.name,
      officer_phone:            officer.phone,
      officer_gender:           officer.gender,
      officer_aadhaar:          officer.aadhaar,
      officer_blood_group:      officer.blood_group,
      officer_teaching_subject: officer.teaching_subject,
      officer_experience:       officer.experience,
      officer_eti_status:       officer.eti_status,
      unit_id:                  officer.unit_id,
      /* nss unit / college */
      nss_unit_code:    officer.nss_unit_code,
      college_name:     officer.college_name,
      district:         officer.district,
      state:            officer.state,
      university_name:  officer.university_name,
      college_address:  officer.college_address,
      college_phone:    officer.college_phone,
      college_email:    officer.college_email,
      /* social links */
      links: linksResult.rows[0] || null,
    });

  } catch (error) {
    console.error("Get Social Links Error:", error);
    res.status(500).json({ message: "Failed to fetch social links" });
  }
};

/* ================= UPDATE ALL ================= */

export const updateSocialLinks = async (req: Request, res: Response) => {
  try {
    const officerId = (req as any).user?.id;
    if (!officerId) return res.status(401).json({ message: "Unauthorized" });

    const officerResult = await pool.query(
      "SELECT unit_id FROM program_officers WHERE id = $1",
      [officerId]
    );

    if (officerResult.rows.length === 0)
      return res.status(404).json({ message: "Officer not found" });

    const unitId = officerResult.rows[0].unit_id;

    const {
      /* officer fields */
      officer_name, officer_phone, officer_gender, officer_aadhaar,
      officer_blood_group, officer_teaching_subject, officer_experience,
      officer_eti_status,
      /* college fields */
      college_name, district, state, university_name,
      college_address, college_phone, college_email,
      /* social links */
      twitter, facebook, instagram, youtube, snapchat, linkedin,
    } = req.body;

    const profileImage = (req.file as Express.Multer.File)?.filename || null;

    /* 1. Update program_officers */
    await pool.query(
      `UPDATE program_officers SET
         name = $1, phone = $2, gender = $3, aadhaar = $4,
         blood_group = $5, teaching_subject = $6,
         experience = $7, eti_status = $8
       WHERE id = $9`,
      [
        officer_name, officer_phone, officer_gender, officer_aadhaar,
        officer_blood_group, officer_teaching_subject,
        officer_experience, officer_eti_status,
        officerId,
      ]
    );

    /* 2. Update nss_units */
    await pool.query(
      `UPDATE nss_units SET
         college_name = $1, district = $2, state = $3,
         university_name = $4, college_address = $5,
         college_phone = $6, college_email = $7
       WHERE id = (SELECT unit_id FROM program_officers WHERE id = $8)`,
      [
        college_name, district, state, university_name,
        college_address, college_phone, college_email,
        officerId,
      ]
    );

    /* 3. Upsert social_links */
    const existing = await pool.query(
      "SELECT id, profile_image FROM social_links WHERE unit_id = $1",
      [unitId]
    );

    if (existing.rows.length > 0) {
      const oldImage = existing.rows[0].profile_image;
      await pool.query(
        `UPDATE social_links SET
           twitter=$1, facebook=$2, instagram=$3,
           youtube=$4, snapchat=$5, linkedin=$6,
           profile_image=$7, updated_at=CURRENT_TIMESTAMP
         WHERE unit_id=$8`,
        [
          twitter, facebook, instagram,
          youtube, snapchat, linkedin,
          profileImage || oldImage,
          unitId,
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO social_links
           (unit_id, twitter, facebook, instagram, youtube, snapchat, linkedin, profile_image)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [unitId, twitter, facebook, instagram, youtube, snapchat, linkedin, profileImage]
      );
    }

    res.json({ message: "Profile updated successfully" });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};