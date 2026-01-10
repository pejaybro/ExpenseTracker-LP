import { userModal } from "../models/user-modal.js";
import path from "path";
import fs from "fs";
import { PROFILE_UPLOAD_DIR } from "../server.js";

export const avatarUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .send({ message: "Error: File could not be uploaded." });
    }
    const user = await userModal.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.profilePicture) {
      const oldFilePath = path.join(PROFILE_UPLOAD_DIR, user.profilePicture);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    user.profilePicture = req.file.filename;
    await user.save();

    const avatarUrl = `${process.env.BASE_URL}/users/upload/profile/${req.file.filename}`;

    res.status(200).json({
      message: "Avatar uploaded successfully",
      url: avatarUrl,
    });
  } catch (error) {
    console.error("Failed", error);
    res.status(500).send({ message: "Server error while saving avatar." });
  } finally {
  }
};
