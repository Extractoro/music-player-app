import bcrypt from "bcrypt";
import * as crypto from 'crypto';
import {getConnection} from "../../connection.js";
import transporterEmail from "../../utils/transporterEmail.js";

export const signupController = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const connection = await getConnection();

        const [existingUser] = await connection.query(
            "SELECT user_id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({ message: "Email is already registered." });
        }

        const verificationToken = crypto.randomBytes(32).toString("hex");
        const resetPasswordToken = crypto.randomBytes(32).toString("hex");

        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.query(
            "INSERT INTO users (username, email, password, verificationToken, resetPasswordToken) VALUES (?, ?, ?, ?, ?)",
            [username, email, hashedPassword, verificationToken, resetPasswordToken]
        );

        // const confirmationUrl = `${process.env.CLIENT_URL}/auth/verify-email?token=${verificationToken}`;
        const confirmationUrl = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;
        await transporterEmail.sendMail({
            to: email,
            from: `Music project <daryna.budnyk@nure.ua>`,
            subject: "Email Verification",
            html: `<p>Hello ${username},</p>
                   <p>Please verify your email by clicking the link below:</p>
                   <a href="${confirmationUrl}">${confirmationUrl}</a>
                   <p>If you did not request this, please ignore this email.</p>`
        });

        connection.release();

        res.status(201).json({ message: "User registered successfully. Please verify your email." });
    } catch (err) {
        res.status(500).json({ message: "Internal server error." });
    }
};