const express = require('express');
const fs = require('fs');
const { Deepgram } = require('@deepgram/sdk');

const router = express.Router();

const deepgramApiKey = process.env.DEEPGRAM_API_KEY;

router.post('/api/files/transcribe', async (req, res) => {
    try {
        console.log('Received request to transcribe file');

        const deepgram = new Deepgram(deepgramApiKey);
        const { file, mimetype } = req.body;

        console.log('Request body:', req.body);

        // Ensure the 'file' and 'mimetype' properties are present in the request body
        if (!file || !mimetype) {
            console.log('File or mimetype is missing in the request body');
            return res.status(400).json({ error: 'File or mimetype missing' });
        }

        let source;

        if (file.startsWith('http')) {
            // File is remote
            source = { url: file };
        } else {
            // File is local
            const audio = fs.readFileSync(file);
            source = { buffer: audio, mimetype };
        }

        const response = await deepgram.transcription.preRecorded(source, {
            smart_format: true,
            model: 'nova',
        });

        console.log('Transcription response:', response);

        res.status(200).json(response);
    } catch (error) {
        console.error('Transcription error:', error);
        res.status(500).json({ error: 'Transcription failed' });
    }
});

module.exports = router;