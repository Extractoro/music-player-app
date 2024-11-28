import cloudinary from "../../utils/cloudinary.js";
import {getConnection} from "../../connection.js";

export const addPerformerController = async (req, res) => {
    const {type, genre, country, name, birthday_date, bio, career_started_date, year_created} = req.body;

    if (!type || !genre || !country) {
        return res.status(400).json({ message: "Type, genre, country are required." });
    }

    if (!["artist", "group"].includes(type)) {
        return res.status(400).json({ message: "Invalid performer type. Must be 'artist' or 'group'." });
    }

    if (type === "artist") {
        if (!name || !birthday_date || !career_started_date) {
            return res.status(400).json({ message: "For artists: name, birthday_date, career_started_date are required." });
        }

        const careerStartedYear = new Date(career_started_date).getFullYear();
        const birthdayYear = new Date(birthday_date).getFullYear();
        if (isNaN(careerStartedYear) || careerStartedYear.toString().length !== 4) {
            return res.status(400).json({ message: "Invalid career_started_date format. Use YYYY." });
        }
        if (isNaN(birthdayYear) || birthdayYear.toString().length !== 4) {
            return res.status(400).json({ message: "Invalid birthdayYear format. Use YYYY." });
        }

    } else if (type === "group") {
        if (!name || !year_created) {
            return res.status(400).json({ message: "For groups: name, year_created are required." });
        }

        const groupYearCreated = new Date(year_created).getFullYear();
        if (isNaN(groupYearCreated) || groupYearCreated.toString().length !== 4) {
            return res.status(400).json({ message: "Invalid year_created format. Use YYYY." });
        }
    }

    try {
        const connection = await getConnection();

        const [existingPerformer] = await connection.query(
            `SELECT p.performer_id
             FROM performer p
             LEFT JOIN artists a ON p.performer_id = a.performer_id
             LEFT JOIN music_groups mg ON p.performer_id = mg.performer_id
             WHERE a.name = ? OR mg.name = ?`,
            [name, name]
        );

        if (existingPerformer.length > 0) {
            connection.release();
            return res.status(400).json({ message: "A performer with the same name already exists." });
        }

        if (!req.file) {
            return res.status(400).json({message: "Photo is required."});
        }

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "performers", resource_type: "image", transformation: [{
                        quality: 'auto', fetch_format: 'auto'
                    }]
                },
                (error, result) => {
                    if (error) {
                        reject("Error uploading to Cloudinary");
                    }
                    resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const photoPath = result.secure_url;

        const [insertPhoto] = await connection.query(
            "INSERT INTO photo (path) VALUES (?)",
            [photoPath]
        );
        const photoId = insertPhoto.insertId;

        const [insertPerformer] = await connection.query(
            "INSERT INTO performer (type, genre, country, photo_id) VALUES (?, ?, ?, ?)",
            [type, genre, country, photoId]
        );
        const performerId = insertPerformer.insertId;

        if (type === "artist") {
            await connection.query(
                "INSERT INTO artists (performer_id, name, birthday_date, bio, career_started_date) VALUES (?, ?, ?, ?, ?)",
                [performerId, name, birthday_date, bio, career_started_date]
            );
        } else if (type === "group") {
            await connection.query(
                "INSERT INTO music_groups (performer_id, name, year_created, bio) VALUES (?, ?, ?, ?)",
                [performerId, name, year_created, bio]
            );
        }

        connection.release();

        res.status(201).json({message: "Performer created successfully!"});
    } catch (error) {
        res.status(500).json({message: "Internal server error."});
    }
};
