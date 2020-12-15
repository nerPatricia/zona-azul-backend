const cors = require("cors");
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(cors());

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// database connection
const dbURI = 'mongodb://localhost:27017/zona-azul'
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .catch((err) => console.log(err));

// routes
app.use(authRoutes);

app.listen(3000, () => {
  console.log('Connected to 3000');
});