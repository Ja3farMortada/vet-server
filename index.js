require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());

// allow Cross-Origin calls to this app
const cors = require("cors");
app.use(cors());

const fs = require("fs");

const http = require("http");
// Redirect HTTP to HTTPS

let options;
if (process.env.NODE_ENV === "production") {
}
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
const socketIO = require("socket.io");
let server;
server = https.createServer(options, app); // Create server from Express app
// if (process.env.NODE_ENV === "production") {
//   server = https.createServer(options, app); // Create server from Express app
// } else {
//   server = http.createServer(app);
// }
const io = socketIO(server, {
  cors: {
    origins: ["*"],
  },
});

const path = require("path");

const { auth, admin } = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

//import routes
const AuthRoutes = require("./routes/auth.routes");
const UsersRoutes = require("./routes/users.routes");
const CustomersRoutes = require("./routes/customers.routes");
const SuppliersRoutes = require("./routes/suppliers.routes");
const StockRoutes = require("./routes/stock.routes");
const ProfileRoutes = require("./routes/profile.routes");
const SellOrdersRoutes = require("./routes/sell-orders.routes");
const HistoryRoutes = require("./routes/history.routes");
const PaymentRoutes = require("./routes/payment.routes");
const BalanceRoutes = require("./routes/balance.routes");
const ExpenseRoutes = require("./routes/expense.routes");
const ReportRoutes = require("./routes/report.routes");
const ReturnRoutes = require("./routes/return.routes");
const ReservationsRoutes = require("./routes/reservations.routes");
const PetsRoutes = require("./routes/pets.routes");

app.use((req, res, next) => {
  req.io = io;
  next();
});

// common routes
app.use("/auth", AuthRoutes);
app.use("/customers", auth, CustomersRoutes);
app.use("/profile", auth, ProfileRoutes);
app.use("/sell-orders", auth, SellOrdersRoutes);
app.use("/history", auth, HistoryRoutes);
app.use("/payment", auth, PaymentRoutes);
app.use("/balance", auth, BalanceRoutes);
app.use("/expense", auth, ExpenseRoutes);
app.use("/report", auth, ReportRoutes);
app.use("/return", auth, ReturnRoutes);
app.use("/suppliers", auth, SuppliersRoutes);
app.use("/stock", StockRoutes);
app.use("/reservations", auth, ReservationsRoutes);
app.use("/pets", auth, PetsRoutes);

// admin routes
app.use("/users", admin, UsersRoutes);

// check API status page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// handle errors
app.use(errorHandler);

module.exports = server;
