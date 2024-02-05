const {OpenAI} = require('openai');

const express = require('express');

const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const router = express.Router();

router.post('/api/files/summarize', async (req, res) => {
    console.log("Received request body:", req.body); // This will log the entire request body
    const { transcription, intro } = req.body;
    try {
        const content = intro + transcription;
        const completion = await openai.chat.completions.create({
            messages: [{role: 'system', content: content}],
            model: "gpt-3.5-turbo-16k",
        });
        console.log(JSON.parse(completion.choices[0].message.content));

        // Send a response with the generated summary
        return res.status(200).json(JSON.parse(completion.choices[0].message.content));
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;