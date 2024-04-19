import express from 'express';

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

// GET User cool
router.get('/cool', (req, res, next) => {
    res.render('cool');
});

export default router;
