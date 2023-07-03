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

// const corsOptions ={
//   origin:'*', 
//   credentials:true, //access-control-allow-credentials:true
//   optionSuccessStatus:200,
// }

app.use(cors())

app.use(express.json());

//#region API ROUTES
// Import routes
const { userRouter, profileRouter, addressRouter, branchRouter, suggestionRouter, categoryRouters, productRouters, inventoryRouters, adminRouter, cartRouter, discountRouter, voucherRouter, cityRouter, shippingRouter, transactionRouter } = require("./routers")

// Add routes
app.use('/api/users', userRouter)
app.use('/api/profiles', profileRouter)
app.use('/api/address', addressRouter)
app.use('/api/branch', branchRouter)
app.use('/api/suggest', suggestionRouter)
app.use('/api/cart', cartRouter)
app.use('/api/city', cityRouter)
app.use('/api/shipping', shippingRouter)
app.use('/api/voucher', voucherRouter)
app.use('/api/transaction', transactionRouter)

app.use("/api/products", express.static(__dirname + "/public/products"));
app.use("/api/categories", express.static(__dirname + "/public/categories"));
app.use("/api/media/profiles", express.static(__dirname + "/public/profiles"));
app.use("/api/category", categoryRouters);
app.use("/api/product", productRouters);
app.use("/api/inventory", inventoryRouters);
app.use("/api/admins", adminRouter);
app.use("/api/discount", discountRouter);
app.use("/api/voucher", voucherRouter)
app.use("/api/products", express.static(__dirname + "/public/products"));
app.use("/api/categories", express.static(__dirname + "/public/categories"));
app.use("/api/media/profiles", express.static(__dirname + "/public/profiles"));

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
