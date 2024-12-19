import { getConnection } from "../../connection.js";

export const getAllGroupsController = async (req, res) => {
    try {
        const connection = await getConnection();

        const [groups] = await connection.query(`
            SELECT
                mg.group_id,
                mg.name,
                mg.performer_id
            FROM music_groups mg
        `);

        connection.release();

        res.status(200).json({
            message: "Groups retrieved successfully.",
            data: groups,
        });
    } catch (error) {
        console.error("Error retrieving groups:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
