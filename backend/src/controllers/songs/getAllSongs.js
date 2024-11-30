import { getConnection } from "../../connection.js";

export const getAllSongsController = async (req, res) => {
    try {
        const connection = await getConnection();

        const [songs] = await connection.query(`
            SELECT 
                s.song_id,
                s.title,
                s.description,
                s.release_date,
                s.duration,
                s.album_id,
                a.title AS album_title,
                s.performer_id,
                ph.path,
                p.type AS performer_type,
                CASE 
                    WHEN p.type = 'artist' THEN ar.name
                    WHEN p.type = 'group' THEN mg.name
                    ELSE NULL
                END AS performer_name
            FROM songs s
            LEFT JOIN albums a ON s.album_id = a.album_id
            LEFT JOIN photo ph ON s.photo_id = ph.photo_id
            JOIN performer p ON s.performer_id = p.performer_id
            LEFT JOIN artists ar ON p.performer_id = ar.performer_id
            LEFT JOIN music_groups mg ON p.performer_id = mg.performer_id
        `);

        connection.release();

        res.status(200).json({
            message: "Songs retrieved successfully.",
            data: songs,
        });
    } catch (error) {
        console.error("Error retrieving songs:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
