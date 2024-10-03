const fs = require("fs");
const https = require("https");

const server = require("./index");

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/your_domain.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/your_domain.com/fullchain.pem"),
};
// server.listen(3500, () => console.log(`listening on port 3500 ...`));
// const PORT = 443; // HTTPS port
https.createServer(options, server).listen(3500, () => {
    console.log(`Server running at https://vet101.online`);
});