const {OpenAI} = require('openai');

const express = require('express');

const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const router = express.Router();

router.post('/api/files/summarize', async (req, res) => {
    const { transcription, summary_type } = req.body;
	console.log("req.body", req.body);

    try {
        // Implement your summarization logic here using the received data
        // For debugging purposes, you can log the received data
        // console.log("Transcription:", transcription);
        // console.log("Summary Type:", summary_type);

        // Dummy response for testing
        const completion = await openai.chat.completions.create({
            messages: [{role: 'system', content: summary_type + transcription}],
            model: "gpt-3.5-turbo-16k",
        });
        console.log(JSON.parse(completion.choices[0]));

        // Send a response with the generated summary
        return res.status(200).json(JSON.parse(completion.choices[0]));
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;