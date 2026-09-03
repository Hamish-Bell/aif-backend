const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "https://aif-website.netlify.app",
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type", "content-type"]
}));

app.options("/send", cors());

app.use(express.json());

app.post("/send", async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.OUTLOOK_EMAIL,
                pass: process.env.OUTLOOK_PASSWORD
            },
            tls: {
                ciphers: "SSLv3"
            }
        });

        await transporter.sendMail({
            from: email,
            to: process.env.OUTLOOK_EMAIL,
            subject: `New message from ${name}`,
            text: message
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
