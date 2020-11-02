const cors = require("cors");
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const {
  requireAuth,
  checkUser
} = require('./middleware/authMiddleware');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(cors());

//console.clear();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://localhost:27017/zona-azul'
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .catch((err) => console.log(err));

// routes
//app.get('*' , checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies' /*, requireAuth*/ , (req, res) => res.render('smoothies'));
app.use(authRoutes);

app.listen(3000, () => {
  console.log('Connected to 3000');
});