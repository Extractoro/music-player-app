import crypto from "crypto";
import { getConnection } from "../../connection.js";
import transporterEmail from "../../utils/transporterEmail.js";

export const requestPasswordResetController = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const connection = await getConnection();

        const [user] = await connection.query(
            "SELECT user_id, username FROM users WHERE email = ?",
            [email]
        );

        if (user.length === 0) {
            return res.status(404).json({ message: "No user found with this email." });
        }

        const resetPasswordToken = crypto.randomBytes(32).toString("hex");

        await connection.query(
            "UPDATE users SET resetPasswordToken = ? WHERE user_id = ?",
            [resetPasswordToken, user[0].user_id]
        );

        const resetUrl = `http://localhost:3000/auth/reset-password?token=${resetPasswordToken}`;
        await transporterEmail.sendMail({
            to: email,
            from: `Music project <daryna.budnyk@nure.ua>`,
            subject: "Password Reset Request",
            html: `<p>Hello ${user[0].username},</p>
                   <p>We received a request to reset your password. Click the link below to reset it:</p>
                   <a href="${resetUrl}">${resetUrl}</a>
                   <p>If you did not request this, please ignore this email.</p>`
        });

        connection.release();

        res.status(200).json({ message: "Password reset link has been sent to your email." });
    } catch (err) {
        res.status(500).json({ message: "Internal server error." });
    }
};
