const http = require('http');
const app = require('./app');

//if default not set then set to port 3000
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);