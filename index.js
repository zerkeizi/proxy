const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express Server
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = "localhost";
// const API_SERVICE_URL = "https://jsonplaceholder.typicode.com";
const API_SERVICE_URL = "https://s3.amazonaws.com/data-production-walltime-info/production/dynamic/walltime-info.json?now=1528962473468.679.0000000000873";


// Logging
app.use(morgan('dev'));

// Info GET endpoint
app.get('/info', (req, res, next) => {
  res.send('This is a proxy service which proxies to Walltime API.');
});

// Authorization
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.ORIGIN || "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});

// Proxy endpoints
app.use('/bitcoin', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
      [`^/bitcoin`]: '',
  },
}));

// Start the Proxy
app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});