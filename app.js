require("dotenv").config();
const express = require("express");
const app = express();
// Behind a reverse proxy (nginx): trust it so req.ip / X-Forwarded-* reflect the
// real client — needed for correct rate limiting, logging and 504 diagnosis.
app.set("trust proxy", 1);
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
    // socket.io v4 uses `origin` (singular). The old `origins` key is the v2
    // spelling and is silently ignored, so CORS was effectively unconfigured.
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    // Prefer websocket but keep polling as fallback.
    transports: ["websocket", "polling"],
    pingInterval: 25000,
    pingTimeout: 20000,
    maxHttpBufferSize: 1e6,
    // Let a briefly-disconnected client resume instead of doing a full
    // reconnect handshake — cuts the reconnect churn that piles onto the app.
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
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
const ReminderRoutes = require("./routes/reminder.routes");
const NotesRoutes = require("./routes/notes.routes");
const SettingsRoutes = require("./routes/settings.routes");
const WhatsappTemplateRoutes = require("./routes/whatsapp-template.routes");

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
app.use("/reminders", auth, ReminderRoutes);
app.use("/notes", auth, NotesRoutes);
app.use("/settings", auth, SettingsRoutes);
app.use("/whatsapp-templates", auth, WhatsappTemplateRoutes);

app.use("/pet-media", auth, require("./routes/pet-media.routes"));

// admin routes
app.use("/users", admin, UsersRoutes);

// app.use(express.static(path.join(__dirname, "app/browser")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// check API status page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// handle errors
app.use(errorHandler);

// Node's default keepAliveTimeout is 5s. If the reverse proxy keeps upstream
// connections alive longer, Node reaps an idle socket the proxy still thinks is
// open → the next request races onto a half-closed socket → the proxy reports
// 502/504 with NO error in the Node logs. Keep these ABOVE the proxy's upstream
// keepalive (nginx default 60s), and headersTimeout above keepAliveTimeout.
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

server.listen(3000, () => console.log(`listening on port 3000 ...`));
