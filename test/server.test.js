'use strict'
const chai = require('chai');
const chaiHttp = require('chai-http');

const { startServer, stopServer, app} = require('../app/server.js');
const { HTTP_STATUS_CODES } = require('../app/config');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Interagation test for: /', function() {
    before(function() {
        return startServer(true);
    });

    after(function() {
        return stopServer();
    });
    
    it('Should return index.html', function () {
        chai.request(app)
            .get('/')
            .then(res => {
                expect(res).to.have.status(HTTP_STATUS_CODES.OK);
                expect(res).to.be.html;
                expect(res.text).to.have.string('<!DOCTYPE html>');
            });
    });
});


