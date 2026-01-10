import multer from "multer";
import path from "path";
import { PROFILE_UPLOAD_DIR } from "../server.js";

const profileStorage = multer.diskStorage({
  // 'destination' is the folder where the file will be saved.
  destination: (req, file, cb) => {
    // We direct all files to our specific profile picture directory.
    cb(null, PROFILE_UPLOAD_DIR);
  },
  // 'filename' determines the name of the file inside the destination folder.
  filename: (req, file, cb) => {
    // req.user.id comes from JWT protect middleware
    const ext = path.extname(file.originalname);
    const filename = `${req.user.id}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// We initialize Multer with our storage configuration.
// This 'upload' constant can now be imported and used in any route that needs to handle file uploads.

export const upload = multer({
  storage: profileStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});
