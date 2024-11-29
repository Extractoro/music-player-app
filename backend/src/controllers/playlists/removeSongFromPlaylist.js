import { getConnection } from "../../connection.js";

export const removeSongFromPlaylistController = async (req, res) => {
    const { id, songId } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "Playlist ID is required.",
        });
    }

    if (!songId) {
        return res.status(400).json({
            message: "Song ID is required.",
        });
    }

    try {
        const connection = await getConnection();

        const [existingEntry] = await connection.query(
            "SELECT * FROM songs_in_playlists WHERE playlist_id = ? AND song_id = ?",
            [id, songId]
        );

        if (existingEntry.length === 0) {
            connection.release();
            return res.status(404).json({
                message: "Song not found in the playlist.",
            });
        }

        await connection.query(
            "DELETE FROM songs_in_playlists WHERE playlist_id = ? AND song_id = ?",
            [id, songId]
        );

        await connection.query(
            `
            UPDATE playlists p
            SET p.duration = (
                SELECT COALESCE(SUM(s.duration), 0)
                FROM songs_in_playlists sip
                JOIN songs s ON sip.song_id = s.song_id
                WHERE sip.playlist_id = p.playlist_id
            )
            WHERE p.playlist_id = ?`,
            [id]
        );

        connection.release();

        res.status(200).json({
            message: "Song removed from playlist and duration updated successfully.",
        });
    } catch (error) {
        console.error("Error removing song from playlist:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
