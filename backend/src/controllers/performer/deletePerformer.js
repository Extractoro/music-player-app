import { getConnection } from "../../connection.js";
import cloudinary from "../../utils/cloudinary.js";

export const deletePerformerController = async (req, res) => {
    const { id } = req.params;

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

        if (performer[0].type === "artist") {
            await connection.query("DELETE FROM artists WHERE performer_id = ?", [id]);
        } else if (performer[0].type === "group") {
            await connection.query("DELETE FROM music_groups WHERE performer_id = ?", [id]);
        }

        const [albums] = await connection.query(
            "SELECT album_id FROM albums WHERE performer_id = ?",
            [id]
        );

        if (albums.length) {
            const albumIds = albums.map((album) => album.album_id);
            await connection.query("DELETE FROM songs WHERE album_id IN (?)", [albumIds]);
            await connection.query("DELETE FROM albums WHERE performer_id = ?", [id]);
        }

        const [photo] = await connection.query(
            "SELECT path FROM photo WHERE photo_id = ?",
            [performer[0].photo_id]
        );
        if (photo.length) {
            const photoPath = photo[0].path;
            const publicId = photoPath
                .split('/')
                .slice(-1)[0]
                .split('.')[0];
            await cloudinary.uploader.destroy(`performers/${publicId}`);
            await connection.query("DELETE FROM photo WHERE photo_id = ?", [performer[0].photo_id]);
        }

        await connection.query("DELETE FROM performer WHERE performer_id = ?", [id]);

        connection.release();
        res.status(200).json({ message: "Performer deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
};
