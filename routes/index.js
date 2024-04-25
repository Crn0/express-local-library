import express from 'express';
const router = express.Router();

function logOriginalUrl(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    next();
}

function logMethod(req, res, next) {
    console.log('Request Type:', req.method);
    next();
}

const logStuff = [logOriginalUrl, logMethod];

router.use((req, res, next) => {
    console.log('Time:', Date.now());
    next();
});

/* GET home page. */
router.get('/', logStuff, (req, res, next) => {
    res.redirect("/catalog");
    // next();
});

export default router;
