import { getConnection } from "../../connection.js";

export const getUserPreferencesController = async (req, res) => {
    try {
        const connection = await getConnection();

        const [typeCounts] = await connection.query(`
            SELECT
                p.user_id,
                perf.type AS performer_type,
                COUNT(*) AS type_count
            FROM playlists AS p
                     JOIN songs_in_playlists AS sp ON p.playlist_id = sp.playlist_id
                     JOIN songs AS s ON sp.song_id = s.song_id
                     JOIN performer AS perf ON s.performer_id = perf.performer_id
            GROUP BY p.user_id, perf.type;
        `);

        const userTotals = {};
        typeCounts.forEach(({ user_id, type_count }) => {
            userTotals[user_id] = (userTotals[user_id] || 0) + type_count;
        });

        const percentages = {};
        typeCounts.forEach(({ user_id, performer_type, type_count }) => {
            const percentage = (type_count / userTotals[user_id]) * 100;
            percentages[performer_type] = (percentages[performer_type] || 0) + percentage;
        });

        const totalUsers = Object.keys(userTotals).length;
        const results = Object.entries(percentages).map(([type, totalPercentage]) => ({
            performer_type: type,
            percentage: (totalPercentage / totalUsers).toFixed(2),
        }));

        connection.release();
        res.status(200).json({ data: results });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user preferences.", error });
    }
};
