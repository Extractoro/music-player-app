import { getConnection } from "../../connection.js";
import cloudinary from "../../utils/cloudinary.js";

export const addSongController = async (req, res) => {
    const { title, description, release_date, duration, album_id, performer_id } = req.body;

    if (!title || !performer_id || !release_date || !duration) {
        return res.status(400).json({
            message: "Title and performer_id, release_date, duration are required.",
        });
    }

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

        if (!req.file) {
            return res.status(400).json({ message: "Song cover photo is required." });
        }

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "songs",
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

        const [performer] = await connection.query(
            "SELECT * FROM performer WHERE performer_id = ?",
            [performer_id]
        );
        if (performer.length === 0) {
            connection.release();
            return res.status(404).json({ message: "Performer not found." });
        }

        if (album_id) {
            const [album] = await connection.query(
                "SELECT * FROM albums WHERE album_id = ?",
                [album_id]
            );
            if (album.length === 0) {
                connection.release();
                return res.status(404).json({ message: "Album not found." });
            }
        }

        await connection.query(
            `INSERT INTO songs (title, description, release_date, duration, album_id, performer_id, photo_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, description, release_date, Number(duration), album_id || null, performer_id, photoId]
        );

        connection.release();

        res.status(201).json({
            message: "Song created successfully!",
        });
    } catch (error) {
        console.error("Error adding song:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
