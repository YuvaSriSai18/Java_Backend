const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Mongo Connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(`Error connecting to MongoDB: ${err}`));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

const authRoute = require("./routes/auth");
app.use("/auth", authRoute);
const eventRoute = require('./routes/Event')
app.use("/event", eventRoute);
// PORT listening
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
