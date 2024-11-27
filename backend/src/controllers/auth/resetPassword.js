import bcrypt from "bcrypt";
import { getConnection } from "../../connection.js";

export const resetPasswordController = async (req, res) => {
    const { newPassword } = req.body;
    const { token } = req.query;

    if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required." });
    }

    try {
        const connection = await getConnection();

        const [user] = await connection.query(
            "SELECT user_id FROM users WHERE resetPasswordToken = ?",
            [token]
        );

        if (user.length === 0) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await connection.query(
            "UPDATE users SET password = ?, resetPasswordToken = NULL WHERE user_id = ?",
            [hashedPassword, user[0].user_id]
        );

        connection.release();

        res.status(200).json({ message: "Password has been successfully reset." });
    } catch (err) {
        res.status(500).json({ message: "Internal server error." });
    }
};
