import jwt from "jsonwebtoken";
import { getConnection } from "../connection.js";

export const adminMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }

    try {
        const connection = await getConnection();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user_id;

        const [result] = await connection.query("SELECT role FROM users WHERE user_id = ?", [userId]);

        if (!result || result[0].role !== "admin") {
            return res.status(403).json({ message: "Access denied, admin required." });
        }

        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token." });
    }
};
