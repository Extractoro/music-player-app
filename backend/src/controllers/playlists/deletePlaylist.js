import { getConnection } from "../../connection.js";

export const deletePlaylistController = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "Playlist ID is required.",
        });
    }

    try {
        const connection = await getConnection();

        const [playlist] = await connection.query(
            "SELECT * FROM playlists WHERE playlist_id = ?",
            [id]
        );

        if (playlist.length === 0) {
            connection.release();
            return res.status(404).json({
                message: "Playlist not found.",
            });
        }

        await connection.query(
            "DELETE FROM songs_in_playlists WHERE playlist_id = ?",
            [id]
        );

        await connection.query("DELETE FROM playlists WHERE playlist_id = ?", [id]);

        connection.release();

        res.status(200).json({
            message: "Playlist deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting playlist:", error);
        res.status(500).json({
            message: "Internal server error.",
        });
    }
};
