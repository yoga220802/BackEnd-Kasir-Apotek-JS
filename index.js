const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');

dotenv.config();

// Initialize express app
const app = express();
app.use(express.json());

// Register routes
app.use('/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is working fine!' });
});

// Database connection and server start
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    await sequelize.sync({ force: false });
    console.log('Models synced successfully.');
  } catch (err) {
    console.error('Failed to connect to the database:', err);
  }
})();

// Export the Express app
module.exports = app;

