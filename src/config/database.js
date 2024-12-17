const { Sequelize } = require('sequelize');
require('dotenv').config();

// Decode base64 CA_PEM
const caPemDecoded = process.env.CA_PEM
  ? Buffer.from(process.env.CA_PEM, 'base64').toString('utf-8')
  : undefined;

// Setup Sequelize
const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      ca: caPemDecoded,
    },
  },
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
})();

// Debugging: Log all environment variables being used
console.log({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
});

module.exports = sequelize;
