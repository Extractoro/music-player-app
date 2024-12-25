import { getConnection } from "../../connection.js";
import cloudinary from "../../utils/cloudinary.js";

export const updatePerformerController = async (req, res) => {
    const { id } = req.params;
    const { genre, country, name, birthday_date, bio, career_started_date, year_created, group_id, start_date, end_date, member_id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Performer ID is required." });
    }

    console.log(member_id)
    console.log(id)


    try {
        const connection = await getConnection();

        const [performer] = await connection.query(
            "SELECT * FROM performer WHERE performer_id = ?",
            [id]
        );

        if (!performer.length) {
            connection.release();
            return res.status(404).json({ message: "Performer not found." });
        }

        if (performer[0].type === "artist") {
            if ((birthday_date && isNaN(new Date(birthday_date).getFullYear())) ||
                (career_started_date && isNaN(new Date(career_started_date).getFullYear()))) {
                connection.release();
                return res.status(400).json({ message: "Invalid date format for artist." });
            }
        }

        if (performer[0].type === "group") {
            if (year_created && isNaN(new Date(year_created).getFullYear())) {
                connection.release();
                return res.status(400).json({ message: "Invalid year_created format for group." });
            }
        }

        let photoId = null;

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "performers",
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

            photoId = photoInsert.insertId;
        }

        await connection.query(
            "UPDATE performer SET genre = COALESCE(?, genre), country = COALESCE(?, country), photo_id = COALESCE(?, photo_id) WHERE performer_id = ?",
            [genre, country, photoId, id]
        );

        if (performer[0].type === "artist") {
            await connection.query(
                "UPDATE artists SET name = COALESCE(?, name), birthday_date = COALESCE(?, birthday_date), bio = COALESCE(?, bio), career_started_date = COALESCE(?, career_started_date) WHERE performer_id = ?",
                [name, birthday_date, bio, career_started_date, id]
            );

            if (group_id) {
                const [artistResult] = await connection.query(
                    "SELECT artist_id FROM artists WHERE performer_id = ?",
                    [id]
                );

                if (!artistResult.length) {
                    connection.release();
                    return res.status(404).json({ message: "Artist not found for the given performer ID." });
                }

                const artist_id = artistResult[0].artist_id;

                const [existingRelation] = await connection.query(
                    "SELECT * FROM artists_in_groups WHERE artist_id = ? AND group_id = ?",
                    [artist_id, group_id]
                );

                if (existingRelation.length) {
                    if ((start_date || existingRelation[0].start_date) && end_date) {
                        const startDate = start_date ? new Date(start_date) : new Date(existingRelation[0].start_date);
                        const endDate = new Date(end_date);

                        if (startDate > endDate) {
                            connection.release();
                            return res.status(400).json({ message: "Start date cannot be later than end date." });
                        }
                    }

                    await connection.query(
                        "UPDATE artists_in_groups SET start_date = COALESCE(?, start_date), end_date = COALESCE(?, end_date) WHERE artist_id = ? AND group_id = ?",
                        [start_date, end_date, artist_id, group_id]
                    );
                } else {
                    connection.release();
                    return res.status(400).json({ message: "Something wrong." });
                }
            }
        } else if (performer[0].type === "group") {
            await connection.query(
                "UPDATE music_groups SET name = COALESCE(?, name), year_created = COALESCE(?, year_created), bio = COALESCE(?, bio) WHERE performer_id = ?",
                [name, year_created, bio, id]
            );

            if (member_id) {
                const [groupResult] = await connection.query(
                    "SELECT group_id FROM music_groups WHERE performer_id = ?",
                    [id]
                );

                if (!groupResult.length) {
                    connection.release();
                    return res.status(404).json({ message: "Group not found for the given performer ID." });
                }

                const group_id = groupResult[0].group_id;

                await connection.query(
                    "DELETE from artists_in_groups WHERE artist_id = ? AND group_id = ?",
                    [member_id, group_id]
                );
            }
        }

        connection.release();

        res.status(200).json({ message: "Performer updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};

