// routes/contact.js

const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// Contact Form Submission
router.post("/submit", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Basic validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Create and save the new contact entry
        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();

        console.log(`✅ New contact message from ${name} (${email})`);
        res.status(201).json({ message: "Thank you for reaching out! We'll get back to you soon." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
});

module.exports = router;
