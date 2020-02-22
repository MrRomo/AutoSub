require('dotenv').config()
const express = require('express');
const session = require('express-session')
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const exphbs = require('express-handlebars')
const logger = require('morgan')
const passport = require('passport');

const app = express();
const { mongo_db } = require('./database')

app.use(logger('dev'))
app.use(cors());
global.multerUploader = require('./config/multer_manager')

const viewsRouter = require('./router/views.js');
const apiRouter = require('./router/api.js');
global.db = new mongo_db(process.env)

// [START session]
// Configure the session and session storage.
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
// [END session]

// OAuth2
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./lib/oauth2').router);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  partialsDir: path.join(app.get('views'), 'partials'),
  layoutsDir: path.join(app.get('views'), 'layouts'),
  extname: '.hbs',
  helpers: require('./config/helpers')
}))


app.use('/public', express.static(path.join(__dirname, './public')));
app.set('view engine', 'hbs');



// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
 
// parse application/json
app.use(express.json())

app.use('/', viewsRouter);
app.use('/api', apiRouter);

app.use((req, res, next) => {
    res.locals.user = req.user || null
    next();
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = (process.env.PORT || '4000');
app.set('port', port);
app.listen(port, () => {
  console.log('Server on port: ', port, "http://localhost:4000");
  console.log("Enviroment: ", app.get('env'));
})