import { getConnection } from "../../connection.js";

export const createPlaylistController = async (req, res) => {
    const { user_id, title, description } = req.body;

    if (!user_id || !title) {
        return res.status(400).json({
            message: "User ID and title are required.",
        });
    }

    try {
        const connection = await getConnection();

        const [user] = await connection.query(
            "SELECT * FROM users WHERE user_id = ?",
            [user_id]
        );

        if (user.length === 0) {
            connection.release();
            return res.status(404).json({ message: "User not found." });
        }

        const [insertResult] = await connection.query(
            "INSERT INTO playlists (user_id, title, description) VALUES (?, ?, ?)",
            [user_id, title, description || null]
        );

        connection.release();

        res.status(201).json({
            message: "Playlist created successfully.",
            data: { playlist_id: insertResult.insertId },
        });
    } catch (error) {
        console.error("Error creating playlist:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
