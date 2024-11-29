import { getConnection } from "../../connection.js";

export const getUserPlaylistsController = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "User ID is required.",
        });
    }

    try {
        const connection = await getConnection();

        const [user] = await connection.query(
            "SELECT * FROM users WHERE user_id = ?",
            [id]
        );

        if (user.length === 0) {
            connection.release();
            return res.status(404).json({ message: "User not found." });
        }

        const [playlists] = await connection.query(
            `
            SELECT 
                p.playlist_id,
                p.title,
                p.description,
                p.duration,
                COUNT(sp.song_id) AS song_count
            FROM playlists p
            LEFT JOIN songs_in_playlists sp ON p.playlist_id = sp.playlist_id
            WHERE p.user_id = ?
            GROUP BY p.playlist_id
            `,
            [id]
        );

        connection.release();

        res.status(200).json({
            message: "Playlists retrieved successfully.",
            data: playlists,
        });
    } catch (error) {
        console.error("Error retrieving playlists:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
