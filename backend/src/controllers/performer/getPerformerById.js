import { getConnection } from "../../connection.js";

export const getPerformerByIdController = async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await getConnection();

        const [performer] = await connection.query(
            "SELECT p.performer_id, p.type, p.genre, p.country, ph.path AS photo FROM performer p " +
            "LEFT JOIN photo ph ON p.photo_id = ph.photo_id WHERE p.performer_id = ?",
            [id]
        );

        if (performer.length === 0) {
            connection.release();
            return res.status(404).json({ message: "Performer not found." });
        }

        const performerData = performer[0];

        if (performerData.type === "artist") {
            const [artist] = await connection.query(
                "SELECT artist_id, name, birthday_date, bio, career_started_date FROM artists WHERE performer_id = ?",
                [id]
            );
            if (artist.length > 0) {
                Object.assign(performerData, artist[0]);
            }
        } else if (performerData.type === "group") {
            const [group] = await connection.query(
                "SELECT group_id, name, year_created, bio FROM music_groups WHERE performer_id = ?",
                [id]
            );
            if (group.length > 0) {
                Object.assign(performerData, group[0]);
            }
        }

        connection.release();

        res.status(200).json(performerData);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};
