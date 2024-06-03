require("dotenv").config();
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const db = require("./config/db");
const route = require("./routes");
const app = express();
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");

const port = process.env.PORT;
// Custom CORS middleware
//config cors
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  // Pass to next layer of middleware
  next();
});

// HTTP logger
app.use(morgan("dev"));

// Connect to Oracle database (user C##QUANLYPHONGKHAM)
db.connect();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "../public")));

// config body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//config cookie-parser
app.use(cookieParser());

// Initialize routes
route(app);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://152.69.209.236",
    method: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("User socket connected >>>>>>>", socket.id);
  socket.on("send-message", (data) => {
    console.log("Message from client>>>>>>>>", data);
    socket.broadcast.emit("receive-message", {...data, id: socket.id});
  });
});

// Start the server
server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
