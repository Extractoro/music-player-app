import { getConnection } from "../../connection.js";

export const getAllAlbumsController = async (req, res) => {
    try {
        const connection = await getConnection();

        const [albums] = await connection.query(`
            SELECT
                a.album_id,
                a.title,
                a.release_date,
                a.description,
                a.performer_id,
                COALESCE(art.artist_id, mg.group_id) AS id,
                COALESCE(art.name, mg.name) AS performer_name,
                p.type AS performer_type,
                ph.path AS photo_path
            FROM albums a
                     JOIN performer p ON a.performer_id = p.performer_id
                     LEFT JOIN artists art ON p.performer_id = art.performer_id
                     LEFT JOIN music_groups mg ON p.performer_id = mg.performer_id
                     LEFT JOIN photo ph ON a.photo_id = ph.photo_id;
        `);

        connection.release();

        res.status(200).json({
            message: "Albums retrieved successfully.",
            data: albums,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};
