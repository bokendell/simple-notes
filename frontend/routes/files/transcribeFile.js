const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { Deepgram } = require('@deepgram/sdk');

const router = express.Router();

const deepgramApiKey = process.env.DEEPGRAM_API_KEY;

router.post('/api/files/transcribe', upload.single('file'), async (req, res) => {
    try {
        console.log('Received request to transcribe file');

        const deepgram = new Deepgram(deepgramApiKey);
        const file = req.file;
        const mimetype = req.file.mimetype

        console.log('File:', file);
        console.log('Mimetype:', mimetype);

        // Ensure the 'file' and 'mimetype' properties are present in the request
        if (!file || !file.path) {
            console.log('File or path is missing in the request');
            return res.status(400).json({ error: 'File or path missing' });
        }

        let source;

        // Read the file using fs.readFileSync
        const fileBuffer = fs.readFileSync(file.path);

        // Set the source with the read buffer and its mimetype
        if (fileBuffer && mimetype) {
            source = { buffer: fileBuffer, mimetype: mimetype };
        } else {
            console.log('Invalid file format');
            return res.status(400).json({ error: 'Invalid file format' });
        }

        // Send the audio to Deepgram and get the response
        deepgram.transcription
                .preRecorded(source, {
                    smart_format: true,
                    model: "nova",
                })
                .then((response) => {
                    // Write the response to the console
                    console.dir(response, { depth: null });
                    res.status(200).json(response);
            
                    // Write only the transcript to the console
                    //console.dir(response.results.channels[0].alternatives[0].transcript, { depth: null });
                })
                .catch((err) => {
                    console.error('Transcription error:', error);
                    res.status(500).json({ error: 'Transcription failed' });
                });
        //delete the file from the uploads folder
        fs.unlinkSync(file.path);
    } catch (error) {
        console.error('Transcription error:', error);
        res.status(500).json({ error: 'Transcription failed' });
    }
});

module.exports = router;