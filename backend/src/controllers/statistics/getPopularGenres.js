import { getConnection } from "../../connection.js";

export const getPopularGenresController = async (req, res) => {
    try {
        const connection = await getConnection();
        const [results] = await connection.query(`
            SELECT p.genre, COUNT(*) AS genre_count
            FROM songs AS s
            JOIN performer AS p ON s.performer_id = p.performer_id
            JOIN songs_in_playlists AS sp ON s.song_id = sp.song_id
            GROUP BY p.genre
            ORDER BY genre_count DESC;
        `);
        connection.release();
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching top songs", error });
    }
};
