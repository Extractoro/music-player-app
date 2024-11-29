import { getConnection } from "../../connection.js";

export const addSongToPlaylistController = async (req, res) => {
    const { id } = req.params;
    const { song_id } = req.body;

    if (!id) {
        return res.status(400).json({
            message: "Playlist ID is required.",
        });
    }

    if (!song_id) {
        return res.status(400).json({
            message: "Song ID is required.",
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
            return res.status(404).json({ message: "Playlist not found." });
        }

        const [song] = await connection.query(
            "SELECT * FROM songs WHERE song_id = ?",
            [song_id]
        );

        if (song.length === 0) {
            connection.release();
            return res.status(404).json({ message: "Song not found." });
        }

        const [existingEntry] = await connection.query(
            "SELECT * FROM songs_in_playlists WHERE playlist_id = ? AND song_id = ?",
            [id, song_id]
        );

        if (existingEntry.length > 0) {
            connection.release();
            return res.status(400).json({
                message: "Song is already in the playlist.",
            });
        }

        await connection.query(
            "INSERT INTO songs_in_playlists (playlist_id, song_id) VALUES (?, ?)",
            [id, song_id]
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

        res.status(201).json({
            message: "Song added to playlist and duration updated successfully.",
        });
    } catch (error) {
        console.error("Error adding song to playlist:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
