const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server.js');

describe('App', () => {
    it('get / should return a 200 response', (done) => {
        request(app).get('/').expect(200, done);
    })

});ß

