const express = require('express');
const multer = require('multer');
const { Deepgram } = require('@deepgram/sdk');

const router = express.Router();

const deepgramApiKey = process.env.DEEPGRAM_API_KEY;

const storage = multer.memoryStorage(); // Store the uploaded file in memory
const upload = multer({ storage: storage });

router.post('/api/files/transcribe', upload.single('file'), async (req, res) => {
    try {
        console.log('Received request to transcribe file');

        const deepgram = new Deepgram(deepgramApiKey);
        const file = req.file;
        const mimetype = req.body.mimetype;

        console.log('File:', file);
        console.log('Mimetype:', mimetype);

        // Ensure the 'file' and 'mimetype' properties are present in the request
        if (!file || !mimetype) {
            console.log('File or mimetype is missing in the request');
            return res.status(400).json({ error: 'File or mimetype missing' });
        }

        let source;

        // Extract data from the file object based on its nature (remote or local)
        if (file.buffer) {
            // File is in memory (uploaded via multer)
            source = { buffer: file.buffer, mimetype };
        } else {
            console.log('Invalid file format');
            return res.status(400).json({ error: 'Invalid file format' });
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