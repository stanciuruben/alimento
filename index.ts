import express, { Express } from 'express';
const app: Express = express();
const cookieParser = require('cookie-parser');

// @ts-ignore next line
app.use(express.json({ extended: false }));
app.use(cookieParser());

//Routes
app.use('/suggestions', require('./routes/suggestions'));

const PORT = 9999;
app.listen(PORT, function () {
   console.log('\x1b[36m', `Listening at http://localhost:${PORT}`);
   console.log('\x1b[0m', '');
});