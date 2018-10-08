'use strict'
const express  = require('express');
const morgan   = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const { PORT, HTTP_STATUS_CODES, MONGO_URL } = require('./config');
const { userRouter } = require('./user/user.router');

let server;

const app = express();

// Middleware 
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static('./public'));

// Router setup
app.use('/api/user', userRouter);

app.use('*', (req, res) => {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
        error: 'Not found.'
    })
});

function startServer() {
    return new Promise((resolve, reject) => {
        mongoose.connect(MONGO_URL, { useNewUrlParser: true }, err => {
            if (err) {
                console.log(err);
                return reject();
            }

            server = app.listen(PORT, () => {
                console.log(`Express server listening on http://localhost:${PORT}`);
            }) 
        });
    });
}

function stopServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            server.close(err => {
                if (err) {
                    console.err(err);
                    return reject();
                }

                console.log('Express server shut down.');
                resolve();
            });
        });
    });
}

module.exports = {
    app,
    startServer,
    stopServer
}