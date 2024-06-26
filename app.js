import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import catalogRouter from './routes/catalog.js';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

// Set up rate limiter: maximum of twenty requests per minute
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

// Set up mongoose connection
// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set('strictQuery', false);
// Define the database URL to connect to.
const mongoDb = process.env.MONGO_DB;

// Wait for database to connect, logging an error if there is a problem
const main = async () => await mongoose.connect(mongoDb);
main().catch(console.error);

// Init dir name variable
const __dirname = import.meta.dirname;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            'script-src': ["'self'", 'code.jquery.com', 'cdn.jsdelivr.net'],
        },
    })
);

app.use(compression()); // Compress all routes

app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
