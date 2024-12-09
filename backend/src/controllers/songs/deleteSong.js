import { getConnection } from "../../connection.js";
import cloudinary from "../../utils/cloudinary.js";

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

        const photoId = song[0].photo_id;

        const [playlists] = await connection.query(
            "SELECT DISTINCT playlist_id FROM songs_in_playlists WHERE song_id = ?",
            [id]
        );

        await connection.query(
            "DELETE FROM songs_in_playlists WHERE song_id = ?",
            [id]
        );

        await connection.query(
            "DELETE FROM songs WHERE song_id = ?",
            [id]
        );

        for (const playlist of playlists) {
            await connection.query(
                `
                UPDATE playlists p
                SET p.duration = (
                    SELECT COALESCE(SUM(s.duration), 0)
                    FROM songs_in_playlists sip
                    JOIN songs s ON sip.song_id = s.song_id
                    WHERE sip.playlist_id = ?
                )
                WHERE p.playlist_id = ?`,
                [playlist.playlist_id, playlist.playlist_id]
            );
        }

        if (photoId) {
            const [photo] = await connection.query(
                "SELECT path FROM photo WHERE photo_id = ?",
                [photoId]
            );

            if (photo.length > 0) {
                const photoPath = photo[0].path;
                const publicId = photoPath.split("/").pop().split(".")[0];

                await cloudinary.uploader.destroy(`songs/${publicId}`);
            }

            await connection.query(
                "DELETE FROM photo WHERE photo_id = ?",
                [photoId]
            );
        }

        connection.release();

        res.status(200).json({ message: "Song deleted successfully and playlist durations updated." });
    } catch (error) {
        console.error("Error deleting song:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
