'use strict'
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const { startServer, stopServer, app} = require('../app/server.js');
const { HTTP_STATUS_CODES } = require('../app/config');

const { User } = require('../app/user/user.model');

const expect = chai.expect;
chai.use(chaiHttp);