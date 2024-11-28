import { getConnection } from "../../connection.js";

export const getSongByIdController = async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await getConnection();

        const [song] = await connection.query(`
            SELECT 
                s.song_id,
                s.title,
                s.description,
                s.release_date,
                s.duration,
                s.album_id,
                a.title AS album_title,
                a.release_date AS album_release_date,
                s.performer_id,
                p.type AS performer_type,
                CASE 
                    WHEN p.type = 'artist' THEN ar.name
                    WHEN p.type = 'group' THEN mg.name
                    ELSE NULL
                END AS performer_name,
                ph.path AS performer_photo
            FROM songs s
            LEFT JOIN albums a ON s.album_id = a.album_id
            JOIN performer p ON s.performer_id = p.performer_id
            LEFT JOIN artists ar ON p.performer_id = ar.performer_id
            LEFT JOIN music_groups mg ON p.performer_id = mg.performer_id
            LEFT JOIN photo ph ON p.photo_id = ph.photo_id
            WHERE s.song_id = ?
        `, [id]);

        connection.release();

        if (song.length === 0) {
            return res.status(404).json({ message: "Song not found." });
        }

        res.status(200).json({
            message: "Song retrieved successfully.",
            data: song[0],
        });
    } catch (error) {
        console.error("Error retrieving song:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
