const express = require('express');
const cookieParser = require('cookie-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const path = require('path');

require('dotenv').config();

const loginRoute = require('./routes/auth/login');
const logoutRoute = require('./routes/auth/logout');
const meRoute = require('./routes/auth/me');
const registerRoute = require('./routes/auth/register');
const verifyRoute = require('./routes/auth/verify');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
	'/api',
	createProxyMiddleware({
	  target: 'http://127.0.0.1:8000',
	  changeOrigin: true,
	  pathRewrite: {
		'^/api': '/api', // Rewrite '/api' prefix to be sent to the target
	  },
	})
  );
  


app.use((req, res, next) => {
	console.log('Incoming request:', req.url, req.method, req.headers, req.body);
	next();
  });

app.use('/api', (req, res, next) => {
	console.log('Outgoing request:', req.url, req.method, req.headers, req.body);
	next();
  });

app.use(loginRoute);
app.use(logoutRoute);
app.use(meRoute);
app.use(registerRoute);
app.use(verifyRoute);

app.use(express.static('client/build'));
app.get('*', (req, res) => {
	return res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
