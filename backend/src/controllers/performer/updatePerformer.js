import { getConnection } from "../../connection.js";

export const updatePerformerController = async (req, res) => {
    const { id } = req.params;
    const { type, genre, country, name, birthday_date, bio, career_started_date, year_created } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Performer ID is required." });
    }

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

        if (type && !["artist", "group"].includes(type)) {
            connection.release();
            return res.status(400).json({ message: "Invalid performer type. Must be 'artist' or 'group'." });
        }

        if (type === "artist" || performer[0].type === "artist") {
            if ((birthday_date && isNaN(new Date(birthday_date).getFullYear())) ||
                (career_started_date && isNaN(new Date(career_started_date).getFullYear()))) {
                connection.release();
                return res.status(400).json({ message: "Invalid date format for artist." });
            }
        }

        if (type === "group" || performer[0].type === "group") {
            if (year_created && isNaN(new Date(year_created).getFullYear())) {
                connection.release();
                return res.status(400).json({ message: "Invalid year_created format for group." });
            }
        }

        await connection.query(
            "UPDATE performer SET type = COALESCE(?, type), genre = COALESCE(?, genre), country = COALESCE(?, country) WHERE performer_id = ?",
            [type, genre, country, id]
        );

        if (performer[0].type === "artist" || type === "artist") {
            await connection.query(
                "UPDATE artists SET name = COALESCE(?, name), birthday_date = COALESCE(?, birthday_date), bio = COALESCE(?, bio), career_started_date = COALESCE(?, career_started_date) WHERE performer_id = ?",
                [name, birthday_date, bio, career_started_date, id]
            );
        } else if (performer[0].type === "group" || type === "group") {
            await connection.query(
                "UPDATE music_groups SET name = COALESCE(?, name), year_created = COALESCE(?, year_created), bio = COALESCE(?, bio) WHERE performer_id = ?",
                [name, year_created, bio, id]
            );
        }

        connection.release();
        res.status(200).json({ message: "Performer updated successfully!" });
    } catch (error) {
        console.error("Error updating performer:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
