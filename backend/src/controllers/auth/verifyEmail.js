import {getConnection} from "../../connection.js";

export const verifyEmailController = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: "Invalid verification token." });
    }

    try {
        const connection = await getConnection();

        const [user] = await connection.query(
            "SELECT user_id FROM users WHERE verificationToken = ?",
            [token]
        );

        if (user.length === 0) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        await connection.query(
            "UPDATE users SET verified = 1, verificationToken = NULL WHERE user_id = ?",
            [user[0].user_id]
        );

        connection.release();

        res.status(200).json({ message: "Email verified successfully." });
    } catch (err) {
        res.status(500).json({ message: "Internal server error." });
    }
};
