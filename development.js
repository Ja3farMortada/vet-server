require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const http = require("http");

// allow Cross-Origin calls to this app
const cors = require("cors");
app.use(cors());

const { auth, admin } = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

// socket init
const server = http.createServer(app);
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
const PurchaseOrdersRoutes = require("./routes/purchase.routes");
const RemindersRoutes = require("./routes/reminders.routes");

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
app.use("/stock", auth, StockRoutes);
app.use("/reservations", auth, ReservationsRoutes);
app.use("/pets", auth, PetsRoutes);
app.use("/supply", auth, PurchaseOrdersRoutes);
app.use("/reminders", auth, RemindersRoutes);

// admin routes
app.use("/users", admin, UsersRoutes);

// check API status page
app.get("/api", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

// launch app
app.use(express.static(path.join(__dirname, "app/browser")));
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "app/browser", "index.html"));
});

// handle errors
app.use(errorHandler);

server.listen(3500, () => console.log(`listening on port 3500 ...`));
