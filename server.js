const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send", async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "Outlook",
            auth: {
                user: process.env.OUTLOOK_EMAIL,
                pass: process.env.OUTLOOK_PASSWORD
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

app.listen(3001, () => console.log("Server running"));
