const app = require("./index");

const http = require("http");

const server = http.createServer(app);
server.listen(3500, () => console.log(`listening on port 3500 ...`));
