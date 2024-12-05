import { getConnection } from "../../connection.js";

export const getCurrentUserController = async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await getConnection();

        const [user] = await connection.query(`
            SELECT user_id, username, email, role FROM users
            WHERE user_id = ?;
        `, [id]);

        connection.release();

        if (user.length === 0) {
            return res.status(404).json({ message: "Album not found." });
        }

        res.status(200).json({
            message: "User retrieved successfully.",
            data: user[0],
        });
    } catch (error) {
        console.error("Error retrieving album:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
