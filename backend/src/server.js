const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/error.middleware');
require('dotenv').config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/tasks', require('./routes/task.routes'));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});