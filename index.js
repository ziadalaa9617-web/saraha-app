const config = require('./src/config');
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/modules/auth/auth.routes');
const errorHandler = require('./src/middlewares/errorHandler');
const { correlationId } = require('./src/middlewares/correlationId');
const app = express();
app.use(correlationId);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('server is running');
});

app.use('/auth', authRoutes);
app.use(errorHandler);

connectDB();

app.listen(config.port, () => {
  console.log(`server running on port ${config.port}`);
});