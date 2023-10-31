process.env.TZ = "Asia/Jakarta";
const express = require("express");
const cors = require("cors");
const app = express();
const passport = require("./lib/passport");
const isAuthenticated = require("./middleware/isAuthenticated");
const checkRole = require("./middleware/roleAccess");
const swaggerJSON = require("./swagger.json");
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(passport.initialize());

const productRoutes = require("./routes/ProductRoute");
app.use("/api/products", productRoutes);

const orderRoutes = require("./routes/OrderRoute");
app.use("/api/orders", orderRoutes);

const AuthenticationRoutes = require("./routes/AuthenticationRoute");
app.use("/api/auth", AuthenticationRoutes);

const AdminRoutes = require("./routes/AdminRoute");
app.use("/api/admin", isAuthenticated, checkRole, AdminRoutes);

const swaggerUI = require("swagger-ui-express");
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerJSON));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
