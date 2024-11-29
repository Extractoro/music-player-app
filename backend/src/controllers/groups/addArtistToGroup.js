import { getConnection } from "../../connection.js";

export const addArtistToGroupController = async (req, res) => {
    const { groupId } = req.params;
    const { artist_id, start_date, end_date } = req.body;

    if (!artist_id || !start_date) {
        return res.status(400).json({
            message: "Artist ID and start date are required.",
        });
    }

    const startDateObj = new Date(start_date);
    const endDateObj = end_date ? new Date(end_date) : null;

    if (isNaN(startDateObj.getTime()) || (end_date && isNaN(endDateObj.getTime()))) {
        return res.status(400).json({
            message: "Invalid date format for start_date or end_date.",
        });
    }

    if (end_date && startDateObj > endDateObj) {
        return res.status(400).json({
            message: "Start date cannot be later than end date.",
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

        const [artist] = await connection.query(
            "SELECT * FROM artists WHERE artist_id = ?",
            [artist_id]
        );

        if (artist.length === 0) {
            connection.release();
            return res.status(404).json({
                message: "Artist not found.",
            });
        }

        const [existingEntry] = await connection.query(
            `
            SELECT * FROM artists_in_groups 
            WHERE artist_id = ? AND group_id = ? 
            AND (end_date IS NULL OR end_date >= ?)
            `,
            [artist_id, groupId, start_date]
        );

        if (existingEntry.length > 0) {
            connection.release();
            return res.status(400).json({
                message: "Artist is already in the group during this period.",
            });
        }

        await connection.query(
            `
            INSERT INTO artists_in_groups (artist_id, group_id, start_date, end_date)
            VALUES (?, ?, ?, ?)
            `,
            [artist_id, groupId, start_date, end_date || null]
        );

        connection.release();

        res.status(201).json({
            message: "Artist added to group successfully.",
        });
    } catch (error) {
        console.error("Error adding artist to group:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
