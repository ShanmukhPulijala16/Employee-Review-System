const dotEnv = require('dotenv');
dotEnv.config();
const session = require('express-session')
const flash = require('connect-flash');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const { db, connectDB } = require('./config/db');
const { setFlash } = require('./config/middleware');
const MongoStore = require('connect-mongo');
// const passport = require('passport');
const passport = require('./config/passport');
const passportLocal = require('./config/passport');

const express = require('express');
const app = express();

// Set the folder for static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up view engine
// Set the directory for EJS templates
app.set('views', path.join(__dirname, 'views'));
// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Configure express-ejs-layouts
app.use(expressLayouts);

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Middleware to use express-session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 3600000,
        collectionName: 'sessions',
        autoRemove: 'native'
    })
}));

// Middleware for passport
app.use(passport.initialize());
app.use(passport.session());

// Set the authenticated user in response
app.use(passport.setAuthenticatedUser);

// Middleware to use flash
app.use(flash());
//Middleware to use setFlash
app.use(setFlash);

app.use('/', require('./routes/index'));

const port = process.env.PORT || 4002;

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is listening on port: ${port}`);
    });
});