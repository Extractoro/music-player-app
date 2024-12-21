import { getConnection } from "../../connection.js";

export const getSongsInPlaylist = async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await getConnection();

        const [songs] = await connection.query(`
            SELECT
                s.song_id,
                s.title,
                s.description,
                s.release_date,
                s.performer_id,
                s.duration,
                s.album_id,
                ph.path AS song_path,
                COALESCE(a.name, mg.name) AS performer_name,
                al.title AS album_name
            FROM songs_in_playlists sip
                     JOIN songs s ON sip.song_id = s.song_id
                     JOIN photo ph ON s.photo_id = ph.photo_id
                     JOIN performer p ON s.performer_id = p.performer_id
                     LEFT JOIN artists a ON p.performer_id = a.performer_id
                     LEFT JOIN music_groups mg ON p.performer_id = mg.performer_id
                     LEFT JOIN albums al ON s.album_id = al.album_id
            WHERE sip.playlist_id = ?;
        `, [id]);

        if (!songs.length) {
            return res.status(404).json({ message: 'No songs found for this playlist.' });
        }

        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving songs in playlist.', error: error.message });
    }
};
