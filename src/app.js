const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const logger = require('morgan');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let loginRouter = require('./routes/login');
let registerRouter = require('./routes/register');
let penyanyiRouter = require('./routes/penyanyi');

const app = express();

// initialize const
const PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

// put routers here
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/penyanyi', penyanyiRouter);

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({error: err.message})
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
})
module.exports = app;
