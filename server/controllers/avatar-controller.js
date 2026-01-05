import { userModal } from "../models/user-modal.js";
import { PORT, uploadDir } from "../server.js";

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

    if (user.profilePicture?.startsWith("/users/")) {
      const oldPath = path.join(
        process.cwd(),
        user.profilePicture.replace("/users/", "users/")
      );

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    const avatarUrl = `/users/upload/profile/${req.file.filename}`;
    user.profilePicture = avatarUrl;
    await user.save();

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
