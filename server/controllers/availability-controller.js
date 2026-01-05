import { userModal } from "../models/user-modal.js";

export const checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        available: false,
        message: "Username is required",
      });
    }

    const exists = await userModal.exists({
      username: username.toLowerCase(),
    });

    return res.status(200).json({
      available: !exists,
    });
  } catch (error) {
    console.error("Username check error:", error);
    return res.status(500).json({
      available: false,
    });
  }
};

export const checkEmailAvailability = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        available: false,
        message: "Email is required",
      });
    }

    const exists = await userModal.exists({
      email: email.toLowerCase(),
    });

    return res.status(200).json({
      available: !exists,
    });
  } catch (error) {
    console.error("Email check error:", error);
    return res.status(500).json({
      available: false,
    });
  }
};
