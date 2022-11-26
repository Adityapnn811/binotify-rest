let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

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
app.use(express.static(path.join(__dirname, 'public')));

// put routers here
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/penyanyi', penyanyiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
})
module.exports = app;
