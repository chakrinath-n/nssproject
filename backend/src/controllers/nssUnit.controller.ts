import { Request, Response } from "express";
import pool from "../config/db";
import bcrypt from "bcrypt";

/* ================= GET ALL NSS UNITS ================= */
export const getNssUnits = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT n.*, 
             p.gender as po_gender,
             p.phone as po_mob_no,
             p.aadhaar as po_aadhaar,
             p.blood_group as po_blood_group,
             p.teaching_subject as po_teaching_subject,
             p.experience as po_experience,
             p.eti_status as po_eti_status
      FROM nss_units n
      LEFT JOIN program_officers p ON p.unit_id = n.id
      ORDER BY n.id ASC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get NSS Units Error:", error);
    res.status(500).json({ message: "Failed to fetch NSS Units" });
  }
};

/* ================= GET NSS UNIT BY ID ================= */
export const getNssUnitById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT n.*,
              p.gender as po_gender,
              p.phone as po_mob_no,
              p.aadhaar as po_aadhaar,
              p.blood_group as po_blood_group,
              p.teaching_subject as po_teaching_subject,
              p.experience as po_experience,
              p.eti_status as po_eti_status
       FROM nss_units n
       LEFT JOIN program_officers p ON p.unit_id = n.id
       WHERE n.id = $1`,
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "NSS Unit not found" });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get NSS Unit Error:", error);
    res.status(500).json({ message: "Failed to fetch NSS Unit" });
  }
};

/* ================= CREATE NSS UNIT ================= */
export const createNssUnit = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      // nss_units columns
      state, district, block, university_name,
      college_code, college_name, governing_body, courses_offered,
      college_type, unit_type, nss_unit_code, adopted_village,
      college_address, college_phone, college_email,
      programme_officer, officer_email,
      // program_officers columns
      po_gender, po_mob_no, po_aadhaar, po_blood_group,
      po_teaching_subject, po_experience, po_eti_status,
    } = req.body;

    if (!district || !nss_unit_code || !college_name || !officer_email) {
      res.status(400).json({
        message: "District, Unit Code, College Name and Officer Email are required",
      });
      return;
    }

    /* ✅ Insert NSS Unit - only nss_units columns */
    const unitResult = await pool.query(
      `INSERT INTO nss_units (
        state, district, block, university_name,
        college_code, college_name, governing_body, courses_offered,
        college_type, unit_type, nss_unit_code, adopted_village,
        college_address, college_phone, college_email,
        programme_officer, officer_email
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17
      ) RETURNING *`,
      [
        state || "Andhra Pradesh", district, block, university_name,
        college_code, college_name, governing_body, courses_offered,
        college_type, unit_type, nss_unit_code, adopted_village,
        college_address, college_phone, college_email,
        programme_officer, officer_email,
      ]
    );

    const unit = unitResult.rows[0];

    /* ✅ Insert Program Officer - with all po_ columns */
    const hashedPassword = await bcrypt.hash(nss_unit_code, 10);

    await pool.query(
      `INSERT INTO program_officers
        (name, email, password, unit_id, phone,
         gender, aadhaar, blood_group, teaching_subject, experience, eti_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        programme_officer, officer_email, hashedPassword, unit.id,
        po_mob_no, po_gender, po_aadhaar, po_blood_group,
        po_teaching_subject, po_experience, po_eti_status,
      ]
    );

    res.status(201).json({
      message: "NSS Unit and Program Officer created successfully",
      unit,
    });

  } catch (error) {
    console.error("Create NSS Unit Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE NSS UNIT ================= */
export const updateNssUnit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      // nss_units columns
      state, district, block, university_name,
      college_code, college_name, governing_body, courses_offered,
      college_type, unit_type, nss_unit_code, adopted_village,
      college_address, college_phone, college_email,
      programme_officer, officer_email,
      // program_officers columns
      po_gender, po_mob_no, po_aadhaar, po_blood_group,
      po_teaching_subject, po_experience, po_eti_status,
    } = req.body;

    /* ✅ Update nss_units table */
    const result = await pool.query(
      `UPDATE nss_units SET
        state=$1, district=$2, block=$3, university_name=$4,
        college_code=$5, college_name=$6, governing_body=$7, courses_offered=$8,
        college_type=$9, unit_type=$10, nss_unit_code=$11, adopted_village=$12,
        college_address=$13, college_phone=$14, college_email=$15,
        programme_officer=$16, officer_email=$17
       WHERE id=$18
       RETURNING *`,
      [
        state || "Andhra Pradesh", district, block, university_name,
        college_code, college_name, governing_body, courses_offered,
        college_type, unit_type, nss_unit_code, adopted_village,
        college_address, college_phone, college_email,
        programme_officer, officer_email,
        id,
      ]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "NSS Unit not found" });

    /* ✅ Update program_officers table */
    await pool.query(
      `UPDATE program_officers SET
        name=$1, email=$2, phone=$3,
        gender=$4, aadhaar=$5, blood_group=$6,
        teaching_subject=$7, experience=$8, eti_status=$9
       WHERE unit_id=$10`,
      [
        programme_officer, officer_email, po_mob_no,
        po_gender, po_aadhaar, po_blood_group,
        po_teaching_subject, po_experience, po_eti_status,
        id,
      ]
    );

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("Update NSS Unit Error:", error);
    res.status(500).json({ message: "Failed to update NSS Unit" });
  }
};

/* ================= DELETE NSS UNIT ================= */
export const deleteNssUnit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM program_officers WHERE unit_id = $1", [id]);
    await pool.query("DELETE FROM nss_units WHERE id = $1", [id]);
    res.status(200).json({ message: "NSS Unit deleted successfully" });
  } catch (error) {
    console.error("Delete NSS Unit Error:", error);
    res.status(500).json({ message: "Failed to delete NSS Unit" });
  }
};