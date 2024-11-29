import { getConnection } from "../../connection.js";

export const removeArtistFromGroupController = async (req, res) => {
    const { groupId, artistId } = req.params;

    if (!groupId || !artistId) {
        return res.status(400).json({
            message: "Group ID and Artist ID are required.",
        });
    }

    try {
        const connection = await getConnection();

        const [group] = await connection.query(
            "SELECT * FROM music_groups WHERE group_id = ?",
            [groupId]
        );

        if (group.length === 0) {
            connection.release();
            return res.status(404).json({
                message: "Group not found.",
            });
        }

        const [artistInGroup] = await connection.query(
            "SELECT * FROM artists_in_groups WHERE group_id = ? AND artist_id = ?",
            [groupId, artistId]
        );

        if (artistInGroup.length === 0) {
            connection.release();
            return res.status(404).json({
                message: "Artist is not part of this group.",
            });
        }

        await connection.query(
            "DELETE FROM artists_in_groups WHERE group_id = ? AND artist_id = ?",
            [groupId, artistId]
        );

        connection.release();

        res.status(200).json({
            message: "Artist removed from group successfully.",
        });
    } catch (error) {
        console.error("Error removing artist from group:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
