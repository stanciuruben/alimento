/* eslint-disable @typescript-eslint/no-var-requires */
import express, { type Express } from 'express';
import cookieParser from 'cookie-parser';
import config from 'config';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import passport from 'passport';

const app: Express = express();

// Static homepage folder
app.use(express.static(path.join(__dirname, '../homepage')));

// @ts-expect-error next line
app.use(express.json({ extended: false }));
const whitelist = ['http://localhost:5173', 'alimento.stanciuruben.com/app'];
const corsOptions = {
	origin: (origin: any, callback: any) => {
		if (origin === undefined || whitelist.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true
};
app.use(cors(corsOptions));
app.use(cookieParser(config.get('SESSION_SECRET')));

// Setup express-session for Passport.js
const SQLiteStore = require('connect-sqlite3')(session);
app.use(
	session({
		// proxy: true,
		secret: config.get('SESSION_SECRET'),
		resave: true,
		saveUninitialized: true,
		store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' }),
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 // 1 Day
		}
	})
);
app.use(passport.authenticate('session'));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/index'));

const PORT = 9999;
app.listen(PORT, function () {
	console.log('\x1b[36m', `Listening at http://localhost:${PORT}`);
	console.log('\x1b[0m', '');
});
