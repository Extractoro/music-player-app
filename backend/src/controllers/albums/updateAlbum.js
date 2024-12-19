import { getConnection } from "../../connection.js";
import cloudinary from "../../utils/cloudinary.js";

export const updateAlbumController = async (req, res) => {
    const { id } = req.params;
    const { title, release_date, description, performer_id } = req.body;

    console.log(req.body)




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

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "albums",
                    resource_type: "image",
                    transformation: [{ quality: "auto", fetch_format: "auto" }],
                },
                (error, result) => {
                    if (error) reject("Error uploading to Cloudinary");
                    resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const photoPath = result.secure_url;

        const [photoInsert] = await connection.query(
            "INSERT INTO photo (path) VALUES (?)",
            [photoPath]
        );
        const photoId = photoInsert.insertId;

        await connection.query(
            `
            UPDATE albums
            SET 
                title = COALESCE(?, title),
                release_date = COALESCE(?, release_date),
                description = COALESCE(?, description),
                performer_id = COALESCE(?, performer_id),
                photoId = COALESCE(?, photo_id)
            WHERE album_id = ?
            `,
            [title, release_date, description, performer_id, photoId, id]
        );

        connection.release();

        res.status(200).json({ message: "Album updated successfully." });
    } catch (error) {
        console.error("Error updating album:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
