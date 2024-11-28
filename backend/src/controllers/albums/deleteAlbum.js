import { getConnection } from "../../connection.js";
import cloudinary from "../../utils/cloudinary.js";

export const deleteAlbumController = async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await getConnection();

        const [album] = await connection.query(
            "SELECT photo_id FROM albums WHERE album_id = ?",
            [id]
        );

        if (album.length === 0) {
            connection.release();
            return res.status(404).json({ message: "Album not found." });
        }

        const photoId = album[0].photo_id;

        await connection.query(
            "DELETE FROM albums WHERE album_id = ?",
            [id]
        );

        if (photoId) {
            const [photo] = await connection.query(
                "SELECT path FROM photo WHERE photo_id = ?",
                [photoId]
            );

            if (photo.length > 0) {
                const photoPath = photo[0].path;
                const publicId = photoPath.split("/").pop().split(".")[0];

                await cloudinary.uploader.destroy(`albums/${publicId}`);
            }

            await connection.query(
                "DELETE FROM photo WHERE photo_id = ?",
                [photoId]
            );
        }

        connection.release();

        res.status(200).json({ message: "Album deleted successfully." });
    } catch (error) {
        console.error("Error deleting album:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
