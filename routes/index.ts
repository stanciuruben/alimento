/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express';
import path from 'path';

const router = express.Router();

router.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '../homepage/index.html'));
});
router.use('/auth/google', require('./auth/google'));

module.exports = router;
