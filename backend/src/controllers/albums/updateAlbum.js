import { getConnection } from "../../connection.js";

export const updateAlbumController = async (req, res) => {
    const { id } = req.params;
    const { title, release_date, description } = req.body;

    try {
        const connection = await getConnection();

        const [existingAlbum] = await connection.query(
            "SELECT * FROM albums WHERE album_id = ?",
            [id]
        );

        if (existingAlbum.length === 0) {
            connection.release();
            return res.status(404).json({ message: "Album not found." });
        }

        if (release_date) {
            const releaseYear = new Date(release_date).getFullYear();
            if (isNaN(releaseYear) || releaseYear.toString().length !== 4) {
                connection.release();
                return res.status(400).json({ message: "Invalid release_date format. Use YYYY-MM-DD." });
            }
        }

        await connection.query(
            `
            UPDATE albums
            SET 
                title = COALESCE(?, title),
                release_date = COALESCE(?, release_date),
                description = COALESCE(?, description)
            WHERE album_id = ?
            `,
            [title, release_date, description, id]
        );

        connection.release();

        res.status(200).json({ message: "Album updated successfully." });
    } catch (error) {
        console.error("Error updating album:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
