/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express';
import path from 'path';

const router = express.Router();

// Homepage
router.get('/', (_req, res) => {
	res.sendFile(path.join(__dirname, '../homepage/index.html'));
});

router.use('/mealplan', require('./mealplan/index'));
router.use('/auth', require('./auth/index'));

module.exports = router;
