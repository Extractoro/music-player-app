import { getConnection } from "../../connection.js";

export const deleteSongController = async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await getConnection();

        const [song] = await connection.query(
            "SELECT * FROM songs WHERE song_id = ?",
            [id]
        );

        if (song.length === 0) {
            connection.release();
            return res.status(404).json({ message: "Song not found." });
        }

        await connection.query(
            "DELETE FROM songs WHERE song_id = ?",
            [id]
        );

        connection.release();

        res.status(200).json({ message: "Song deleted successfully." });
    } catch (error) {
        console.error("Error deleting song:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
