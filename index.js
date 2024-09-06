require("dotenv").config();
const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const app = express();
const credentials = require("./middlewares/credentials");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middlewares/verifyJWT");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnection");

// Connect to MongoDB
connectDB();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// routes
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/notification", require("./routes/notifications"));
app.use("/users", require("./routes/users"));

mongoose.connection.once("open", () => {
  app.listen(3000, () => {
    console.log("Servidor está funcionando");
  });
});
