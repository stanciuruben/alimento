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

// Static homepage folder
app.use(express.static(path.join(__dirname, '../homepage')));
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../homepage/index.html'));
});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));
app.use(passport.authenticate('session'));

// Routes
app.use('/suggestions', require('./routes/suggestions'));
app.use('/', require('./routes/auth'));

const PORT = 9999;
app.listen(PORT, function () {
  console.log('\x1b[36m', `Listening at http://localhost:${PORT}`);
  console.log('\x1b[0m', '');
});
