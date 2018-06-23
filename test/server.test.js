const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server.js');

describe('App', () => {
    it('get / should return a 200 response', (done) => {
        request(app).get('/').expect(200, done);
    })

    xit('get /auth/login should return a 200 response', (done) => {
        request(app).get('/auth/login').expect(200, done);
    })

    xit('get auth/signup should return a 200 response', (done) => {
        request(app).get('/').expect(200, done);
    })

})

