/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express';

const router = express.Router();

router.use('/auth', require('./auth/index'));
router.use('/mealplan', require('./mealplan/index'));
router.use('/user', require('./user/index'));

module.exports = router;
