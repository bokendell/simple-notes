const express = require('express');
const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));

const router = express.Router();

router.post('/api/files/create/', async (req, res) => {
    const { access } = req.cookies;
    const { name, s3_url } = req.body;

    try {
        const apiRes = await fetch(`${process.env.API_URL}/api/files/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`,
            },
            body: JSON.stringify({
                name,
                s3_url,
            }),
        });

        const data = await apiRes.json();

        return res.status(apiRes.status).json(data);
    } catch (err) {
        return res.status(500).json({
            error: 'Something went wrong when trying to retrieve user files',
        });
    }
});

module.exports = router;