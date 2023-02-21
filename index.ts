/* eslint-disable @typescript-eslint/no-var-requires */
import express, { type Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import passport from 'passport';
import session from 'express-session';

const SQLiteStore = require('connect-sqlite3')(session);
const app: Express = express();

// @ts-expect-error next line
app.use(express.json({ extended: false }));
app.use(cors()); // Checkout docs on cors whitelist before deploying
app.use(cookieParser());

// Setup express-session for Passport.js
app.use(session({
  secret: 'keyboard cat', // Get form .env/config
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));
app.use(passport.authenticate('session'));

// Static homepage folder
app.use(express.static(path.join(__dirname, '../homepage')));

// Routes
app.use('/', require('./routes/index'));

const PORT = 9999;
app.listen(PORT, function () {
  console.log('\x1b[36m', `Listening at http://localhost:${PORT}`);
  console.log('\x1b[0m', '');
});
