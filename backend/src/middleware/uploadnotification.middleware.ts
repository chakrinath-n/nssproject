import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "uploads/notifications";

// create folder if not exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadPath),

  filename: (_req, file, cb) => {
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, unique);
  },
});

export const uploadNotification = multer({ storage });