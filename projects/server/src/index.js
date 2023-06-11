require("dotenv/config");
const express = require("express");
const cors = require("cors");
const { join } = require("path");
const db = require("./models");

const PORT = process.env.PORT || 8000;
const app = express();
// app.use(
//   cors({
//     origin: [process.env.WHITELISTED_DOMAIN && process.env.WHITELISTED_DOMAIN.split(",")],
//   })
// );

app.use(cors())

app.use(express.json());

//#region API ROUTES
// Import routes
const { userRouter, profileRouter, addressRouter, branchRouter, suggestionRouter } = require("./routers")

// Add routes
app.use('/api/users', userRouter)
app.use('/api/profiles', profileRouter)
app.use('/api/address', addressRouter)
app.use('/api/branch', branchRouter)
app.use('/api/suggest', suggestionRouter)

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));
app.use(express.static(__dirname + '/public'));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    // db.sequelize.sync({alter: true})
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
