const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

require('dotenv').config();

const loginRoute = require('./routes/auth/login');
const logoutRoute = require('./routes/auth/logout');
const meRoute = require('./routes/auth/me');
const registerRoute = require('./routes/auth/register');
const verifyRoute = require('./routes/auth/verify');
const filesRoute = require('./routes/files/files');
const transcribeRoute = require('./routes/files/transcribeFile');
const createFileRoute = require('./routes/files/createFile');
const summarizeFileRoute = require('./routes/files/summarizeFile');
const deleteFileRoute = require('./routes/files/deleteFile');
const presignedUrlRoute = require('./routes/files/getURL');
const updateRoute = require('./routes/auth/update');

const corsOptions = {
	origin: 'simple-notes-frontend-dev.us-east-2.elasticbeanstalk.com', // This should match the domain of your React frontend
	credentials: true, // This is important for cookies to be sent
  };

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(loginRoute);
app.use(logoutRoute);
app.use(meRoute);
app.use(registerRoute);
app.use(verifyRoute);
app.use(filesRoute);
app.use(transcribeRoute);
app.use(createFileRoute);
app.use(summarizeFileRoute);
app.use(deleteFileRoute);
app.use(presignedUrlRoute);
app.use(updateRoute);

app.use(express.static(path.join(__dirname, 'client/build')));



app.use(express.static('client/build'));
app.get('*', (req, res) => {
	return res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
