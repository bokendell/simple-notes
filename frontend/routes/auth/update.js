const express = require('express');
const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));

const router = express.Router();

router.put('/api/users/update', async (req, res) => {
	const {transcriptions_left, transcriptions_made } = req.body;
	const body = JSON.stringify({
		transcriptions_left,
        transcriptions_made,
	});
    console.log(body);

	try {
		const apiRes = await fetch(`${process.env.API_URL}/api/users/update`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body,
		});

		const data = await apiRes.json();

		return res.status(apiRes.status).json(data);
	} catch (err) {
		return res.status(500).json({
			error: 'Something went wrong when updating account',
		});
	}
});

module.exports = router;
