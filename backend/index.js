require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');
const webhookRoutes = require('./routes/webhook');
const transactionsRoutes = require('./routes/transactions');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');



const app = express();
// app.use(cors());
const allowedOrigins = [
  'http://localhost:5173',
  'https://edviron-gateway.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  credentials: true, 
}));


app.use(morgan('dev'));
app.use(express.json());

connectDB();

app.get('/', (req, res) => res.json({ ok: true, status:"Backend is Up and Running", message: 'Backend for School Payments Dashboard gateway - Programmed By : piyushpatelcodes@gmail.com' }));

app.use('/auth', authRoutes);
app.use('/payments', paymentRoutes);
app.use('/webhook', webhookRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
