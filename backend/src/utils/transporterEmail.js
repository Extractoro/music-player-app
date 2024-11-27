import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporterEmail = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASSWORD,
    },
});

export default transporterEmail