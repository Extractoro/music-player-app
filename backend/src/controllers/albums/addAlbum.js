import { getConnection } from "../../connection.js";
import cloudinary from "../../utils/cloudinary.js";

export const addAlbumController = async (req, res) => {
    const { title, description, release_date, performer_id } = req.body;

    if (!title || !release_date || !performer_id) {
        return res.status(400).json({ message: "Title, release_date, and performer_id are required." });
    }

    try {
        const connection = await getConnection();

        const [performer] = await connection.query(
            "SELECT * FROM performer WHERE performer_id = ?",
            [performer_id]
        );

        if (!performer.length) {
            connection.release();
            return res.status(404).json({ message: "Performer not found." });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Album cover photo is required." });
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
            "INSERT INTO albums (title, description, release_date, performer_id, photo_id) VALUES (?, ?, ?, ?, ?)",
            [title, description, release_date, performer_id, photoId]
        );

        connection.release();

        res.status(201).json({ message: "Album added successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};
