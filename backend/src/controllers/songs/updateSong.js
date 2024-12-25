import { getConnection } from "../../connection.js";

export const updateSongController = async (req, res) => {
    const { id } = req.params;
    const { title, description, release_date, duration, album_id, performer_id } = req.body;
    
    // if (!title && !description && !release_date && !duration && !album_id && !performer_id) {
    //     return res.status(400).json({ message: "No fields to update." });
    // }

    if (release_date) {
        const releaseDateObject = new Date(release_date);
        if (isNaN(releaseDateObject.getTime())) {
            return res.status(400).json({
                message: "Invalid release_date format. Use YYYY-MM-DD.",
            });
        }

        const today = new Date();
        if (releaseDateObject > today) {
            return res.status(400).json({
                message: "release_date cannot be in the future.",
            });
        }
    }

    if (duration) {
        if (isNaN(duration) || duration <= 0) {
            return res.status(400).json({
                message: "Duration must be a positive number.",
            });
        }
    }

    try {
        const connection = await getConnection();

        const [existingSong] = await connection.query(
            "SELECT * FROM songs WHERE song_id = ?",
            [id]
        );

        if (existingSong.length === 0) {
            connection.release();
            return res.status(404).json({ message: "Song not found." });
        }

        if (album_id) {
            const [albumExists] = await connection.query(
                "SELECT * FROM albums WHERE album_id = ?",
                [album_id]
            );
            if (albumExists.length === 0) {
                connection.release();
                return res.status(400).json({ message: "Specified album does not exist." });
            }
        }

        if (performer_id) {
            const [performerExists] = await connection.query(
                "SELECT * FROM performer WHERE performer_id = ?",
                [performer_id]
            );
            if (performerExists.length === 0) {
                connection.release();
                return res.status(400).json({ message: "Specified performer does not exist." });
            }
        }

        await connection.query(
            `
            UPDATE songs
            SET 
                title = COALESCE(?, title),
                description = COALESCE(?, description),
                release_date = COALESCE(?, release_date),
                duration = COALESCE(?, duration),
                album_id = ?,
                performer_id = COALESCE(?, performer_id)
            WHERE song_id = ?
            `,
            [title, description, release_date, duration, album_id, performer_id, id]
        );

        connection.release();

        res.status(200).json({ message: "Song updated successfully." });
    } catch (error) {
        console.error("Error updating song:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
