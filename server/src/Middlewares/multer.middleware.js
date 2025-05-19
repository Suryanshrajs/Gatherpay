import multer from "multer";
import path from "path";
import fs from "fs";

const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};
const uploadDir = "uploads/";
ensureDirectoryExists(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const customDir = req.customUploadDir || uploadDir;
    ensureDirectoryExists(customDir);
    cb(null, customDir);
  },
  filename: (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const uniqueName = `gatherpay${randomDigits}${ext}`;
  cb(null, uniqueName);
}

});

const validImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const fileFilter = (req, file, cb) => {
  if (validImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files (jpeg, png, webp, gif) are allowed!"),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
