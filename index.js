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

// Start server
const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    await sequelize.sync({ force: false });
    console.log('Models synced successfully.');

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
})();
