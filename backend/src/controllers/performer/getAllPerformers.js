import { getConnection } from "../../connection.js";

export const getPerformersController = async (req, res) => {
    try {
        const connection = await getConnection();

        const [performers] = await connection.query(`
            SELECT p.performer_id, p.type, p.genre, p.country, ph.path AS photo_path
            FROM performer p
            LEFT JOIN photo ph ON p.photo_id = ph.photo_id
        `);

        for (let performer of performers) {
            if (performer.type === 'artist') {
                const [artistDetails] = await connection.query(
                    "SELECT name, birthday_date, bio, career_started_date FROM artists WHERE performer_id = ?",
                    [performer.performer_id]
                );
                performer.artistDetails = artistDetails[0];
            } else if (performer.type === 'group') {
                const [groupDetails] = await connection.query(
                    "SELECT name, year_created, bio FROM music_groups WHERE performer_id = ?",
                    [performer.performer_id]
                );
                performer.groupDetails = groupDetails[0];
            }
        }

        connection.release();

        res.status(200).json(performers);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};
