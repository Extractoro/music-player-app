import { getConnection } from "../../connection.js";

export const getTopSongsController = async (req, res) => {
    try {
        const connection = await getConnection();
        const [results] = await connection.query(`
            SELECT s.title AS song_title, COUNT(sp.playlist_id) AS add_count
            FROM songs_in_playlists sp
            JOIN songs s ON sp.song_id = s.song_id
            GROUP BY s.song_id
            ORDER BY add_count DESC
            LIMIT 10;
        `);
        connection.release();
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching top songs", error });
    }
};
