const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "https://aif-website.netlify.app",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.post("/send", async (req, res) => {
    console.log("POST /send received");
    console.log("Request body:", req.body);

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            error: "Missing name, email, or message"
        });
    }

    try {
        console.log("Creating SMTP transporter...");

        const transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false,

            auth: {
                user: process.env.OUTLOOK_EMAIL,
                pass: process.env.OUTLOOK_PASSWORD
            },

            tls: {
                minVersion: "TLSv1.2"
            },

            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000
        });

        console.log("Sending email...");

        const info = await transporter.sendMail({
            from: process.env.OUTLOOK_EMAIL,
            to: process.env.OUTLOOK_EMAIL,
            replyTo: email,
            subject: `New message from ${name}`,
            text: `Name: ${name}

Email: ${email}

Message:
${message}`
        });

        console.log("Email sent:", info.messageId);

        res.status(200).json({
            success: true,
            message: "Email sent successfully"
        });

    } catch (error) {
        console.error("EMAIL ERROR:");
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});