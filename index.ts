/* eslint-disable @typescript-eslint/no-var-requires */
import express, { type Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
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

// Routes
app.use('/suggestions', require('./routes/suggestions'));

const PORT = 9999;
app.listen(PORT, function () {
  console.log('\x1b[36m', `Listening at http://localhost:${PORT}`);
  console.log('\x1b[0m', '');
});
