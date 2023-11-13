import express from 'express';

const router = express.Router();

router.route('/').post((req, res) => {
    res.status(201).json({});
});

export default router;
