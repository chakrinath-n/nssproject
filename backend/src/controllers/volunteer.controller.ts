import { Request, Response } from "express";
import pool from "../config/db";

/* ================= ADD VOLUNTEER ================= */

export const addVolunteer = async (req: Request, res: Response) => {

  try {

    const officerId = (req as any).user?.id;

    if (!officerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    /* GET UNIT ID */
    const officerResult = await pool.query(
      "SELECT unit_id FROM program_officers WHERE id=$1",
      [officerId]
    );

    if (officerResult.rows.length === 0) {
      return res.status(404).json({ message: "Officer not found" });
    }

    const unitId = officerResult.rows[0].unit_id;

    /* PHOTO */
    let photoPath: string | null = null;
    if (req.file) {
      photoPath = req.file.filename;
    }

    /* BODY */
    const {
      hallticket_no,
      student_name,
      dob,
      course,
      year,
      semester,
      gender,
      category,
      contact_number,
      blood_group,
      email,
      aadhaar_number,
      nss_group_number,
      father_name,
      father_occupation,
      address,
      permanent_address,
      willing_donate_blood,
      entry_date
    } = req.body;

    /* TYPE FIX */
    const yearInt = year ? parseInt(year) : null;
    const semesterInt = semester ? parseInt(semester) : null;

    let bloodDonate: boolean | null = null;
    if (willing_donate_blood === "true") bloodDonate = true;
    if (willing_donate_blood === "false") bloodDonate = false;

    /* INSERT */
    await pool.query(

      `INSERT INTO volunteers (
        hallticket_no,
        student_name,
        dob,
        course,
        year,
        semester,
        gender,
        category,
        contact_number,
        blood_group,
        email,
        photo,
        aadhaar_number,
        date_of_join,
        nss_group_number,
        father_name,
        father_occupation,
        address,
        permanent_address,
        willing_donate_blood,
        entry_date,
        unit_id
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22
      )`,

      [
        hallticket_no,     // $1
        student_name,      // $2
        dob,               // $3
        course,            // $4
        yearInt,           // $5
        semesterInt,       // $6
        gender,            // $7
        category,          // $8
        contact_number,    // $9
        blood_group,       // $10
        email,             // $11
        photoPath,         // $12
        aadhaar_number,    // $13 ✅ FIXED
        entry_date,        // $14 date_of_join ✅ FIXED
        nss_group_number,  // $15 ✅
        father_name,       // $16 ✅
        father_occupation, // $17 ✅
        address,           // $18 ✅
        permanent_address, // $19 ✅
        bloodDonate,       // $20 ✅
        entry_date,        // $21 entry_date ✅
        unitId             // $22 ✅
      ]
    );

    res.json({ message: "Volunteer added successfully" });

  } catch (error) {
    console.error("Add Volunteer Error:", error);
    res.status(500).json({ message: "Failed to add volunteer" });
  }

};

/* ================= GET VOLUNTEERS ================= */

export const getVolunteers = async (req: Request, res: Response) => {

  try {

    const officerId = (req as any).user?.id;

    if (!officerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const officerResult = await pool.query(
      "SELECT unit_id FROM program_officers WHERE id=$1",
      [officerId]
    );

    if (officerResult.rows.length === 0) {
      return res.status(404).json({ message: "Officer not found" });
    }

    const unitId = officerResult.rows[0].unit_id;

    const volunteers = await pool.query(
      "SELECT * FROM volunteers WHERE unit_id=$1 ORDER BY id DESC",
      [unitId]
    );

    res.json(volunteers.rows);

  } catch (error) {
    console.error("Get Volunteers Error:", error);
    res.status(500).json({ message: "Failed to fetch volunteers" });
  }

};
/* ================= DELETE VOLUNTEER ================= */

export const deleteVolunteer = async (req: Request, res: Response) => {
  try {
    const officerId = (req as any).user?.id;
    if (!officerId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    await pool.query("DELETE FROM volunteers WHERE id=$1", [id]);

    res.json({ message: "Volunteer deleted successfully" });

  } catch (error) {
    console.error("Delete Volunteer Error:", error);
    res.status(500).json({ message: "Failed to delete volunteer" });
  }
};

/* ================= UPDATE VOLUNTEER ================= */

export const updateVolunteer = async (req: Request, res: Response) => {
  try {
    const officerId = (req as any).user?.id;
    if (!officerId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    const {
      hallticket_no, student_name, dob, course, year, semester,
      gender, category, contact_number, blood_group, email,
      aadhaar_number, nss_group_number, father_name, father_occupation,
      address, permanent_address, willing_donate_blood, entry_date
    } = req.body;

    const yearInt = year ? parseInt(year) : null;
    const semesterInt = semester ? parseInt(semester) : null;

    let bloodDonate: boolean | null = null;
    if (willing_donate_blood === "true") bloodDonate = true;
    if (willing_donate_blood === "false") bloodDonate = false;

    let photoPath: string | undefined = undefined;
    if (req.file) photoPath = req.file.filename;

    // Build query dynamically based on whether photo is updated
    if (photoPath) {
      await pool.query(
        `UPDATE volunteers SET
          hallticket_no=$1, student_name=$2, dob=$3, course=$4,
          year=$5, semester=$6, gender=$7, category=$8,
          contact_number=$9, blood_group=$10, email=$11,
          aadhaar_number=$12, nss_group_number=$13, father_name=$14,
          father_occupation=$15, address=$16, permanent_address=$17,
          willing_donate_blood=$18, entry_date=$19, photo=$20
        WHERE id=$21`,
        [
          hallticket_no, student_name, dob, course,
          yearInt, semesterInt, gender, category,
          contact_number, blood_group, email,
          aadhaar_number, nss_group_number, father_name,
          father_occupation, address, permanent_address,
          bloodDonate, entry_date, photoPath, id
        ]
      );
    } else {
      await pool.query(
        `UPDATE volunteers SET
          hallticket_no=$1, student_name=$2, dob=$3, course=$4,
          year=$5, semester=$6, gender=$7, category=$8,
          contact_number=$9, blood_group=$10, email=$11,
          aadhaar_number=$12, nss_group_number=$13, father_name=$14,
          father_occupation=$15, address=$16, permanent_address=$17,
          willing_donate_blood=$18, entry_date=$19
        WHERE id=$20`,
        [
          hallticket_no, student_name, dob, course,
          yearInt, semesterInt, gender, category,
          contact_number, blood_group, email,
          aadhaar_number, nss_group_number, father_name,
          father_occupation, address, permanent_address,
          bloodDonate, entry_date, id
        ]
      );
    }

    res.json({ message: "Volunteer updated successfully" });

  } catch (error) {
    console.error("Update Volunteer Error:", error);
    res.status(500).json({ message: "Failed to update volunteer" });
  }
};

/* ================= PUBLIC - GET VOLUNTEERS BY UNIT CODE ================= */

export const getPublicVolunteersByUnit = async (req: Request, res: Response) => {
  try {
    const { unit_code } = req.params;
    const { year } = req.query;

    // Find unit
    const unitResult = await pool.query(
      "SELECT id, college_name, nss_unit_code FROM nss_units WHERE nss_unit_code=$1",
      [unit_code]
    );

    if (unitResult.rows.length === 0)
      return res.status(404).json({ message: "Unit not found" });

    const unit = unitResult.rows[0];

    let query = `
      SELECT * FROM volunteers
      WHERE unit_id=$1
    `;
    const params: any[] = [unit.id];

    if (year) {
      query += ` AND EXTRACT(YEAR FROM entry_date) = $2`;
      params.push(year);
    }

    query += ` ORDER BY student_name ASC`;

    const result = await pool.query(query, params);

    // Stats
    const volunteers = result.rows;
    const total = volunteers.length;
    const male = volunteers.filter(v => v.gender === "Male").length;
    const female = volunteers.filter(v => v.gender === "Female").length;
    const sc = volunteers.filter(v => v.category === "SC").length;
    const st = volunteers.filter(v => v.category === "ST").length;
    const bc = volunteers.filter(v => v.category === "BC").length;
    const others = volunteers.filter(v => !["SC","ST","BC"].includes(v.category)).length;

    res.json({
      unit,
      volunteers,
      stats: { total, male, female, sc, st, bc, others },
    });

  } catch (error) {
    console.error("Public Volunteers Error:", error);
    res.status(500).json({ message: "Failed to fetch volunteers" });
  }
};