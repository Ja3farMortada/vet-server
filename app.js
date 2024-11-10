const app = require("./index");

const fs = require("fs");
const http = require("http");
// Redirect HTTP to HTTPS

let options;
http
  .createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
  })
  .listen(80);

options = {
  key: fs.readFileSync("/etc/letsencrypt/live/vet101.online/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/vet101.online/fullchain.pem"),
};
// create server for socket.io
const https = require("https");

const server = https.createServer(options, app); // Create server from Express app

const socketIO = require("socket.io");
const io = socketIO(server, {
  cors: {
    origins: ["*"],
  },
});
app.use((req, res, next) => {
  req.io = io;
  next();
});
server.listen(443, () => console.log(`listening on port 443 ...`));
