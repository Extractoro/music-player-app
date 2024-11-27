import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getConnection } from "../../connection.js";

export const loginController = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const connection = await getConnection();

        const [user] = await connection.query(
            "SELECT user_id, password, verified, role FROM users WHERE email = ?",
            [email]
        );

        if (user.length === 0) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const foundUser = user[0];

        if (!foundUser.verified) {
            return res.status(403).json({ message: "Please verify your email before logging in." });
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { user_id: foundUser.user_id, role: foundUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        connection.release();

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                user_id: foundUser.user_id,
                role: foundUser.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error." });
    }
};
