const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./src/config/database");
const routes = require("./src/routes");
const cors = require("cors");

dotenv.config();

// Initialize express app
const app = express();
app.use(express.json());

// Add cors middleware
app.use(cors());

// Register all routes
app.use("/", routes);

// Database connection and server start
(async () => {
 try {
  await sequelize.authenticate();
  console.log("Database connection established.");

  await sequelize.sync({ force: false });
  console.log("Models synced successfully.");

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
  });
 } catch (err) {
  console.error("Failed to connect to the database:", err);
 }
})();

module.exports = app;
