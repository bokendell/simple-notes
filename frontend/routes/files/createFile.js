const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/api/files/create/', upload.single('file'), async (req, res) => {
    const { access } = req.cookies;
    const file = req.file;

    // const name = req.body.name;

    const formData = new FormData();
    formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
    });

    // if (name) {
    //     formData.append('name', name);
    // }

    try {
        const apiRes = await fetch(`${process.env.API_URL}/api/files/create/`, {
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`,
            },
            // body: JSON.stringify({
            //     name,
            //     s3_url,
            // }),
            body: formData,
        });

        const data = await apiRes.json();

        return res.status(apiRes.status).json(data);
    } catch (err) {
        return res.status(500).json({
            error: 'Something went wrong when trying upload the file. Please try again.',
        });
    }
});

module.exports = router;