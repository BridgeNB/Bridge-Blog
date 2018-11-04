'use strict'
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const jsonwebtoken = require('jsonwebtoken');

const { startServer, stopServer, app} = require('../app/server.js');
const { HTTP_STATUS_CODES, JWT_SECRET, JWT_EXPIRY } = require('../app/config');

const { User } = require('../app/user/user.model');
const { Blog } = require('../app/blog/blog.model');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Integration test for: /api/blog', function() {
    let fakeUser, jwtToken;
    before(function() {
        return startServer(true);
    });
    after(function() {
        return stopServer();
    });
    beforeEach(function() {
        fakeUser = createFakerUser();
        return User.hashPassword(fakeUser.password).then(hashedPassword => {
            return User.create({
                name: fakeUser.name,
                email: fakeUser.email,
                username: fakeUser.username,
                password: hashedPassword
            })
                .then(createdUser => {
                    fakeUser.id = createdUser.id;

                    jwtToken = jsonwebtoken.sign(
                        {
                            user: {
                                id: fakeUser.id,
                                name: fakeUser.name,
                                email: fakeUser.email,
                                username: fakeUser.username
                            }
                        },
                        JWT_SECRET,
                        {
                            algorithm: 'HS256',
                            expiresIn: JWT_EXPIRY,
                            subject: fakeUser.username
                        }
                    );

                    const seedData = [];
                    for (let i = 0; i <= 10; ++i) {
                        const newBlog = createFakerBlog();
                        newBlog.user = createdUser.id;
                        seedData.push(newBlog);
                    }
                    return Blog.insertMany(seedData)
                        .catch(err => {
                            console.error(err);
                            throw new Error(err);
                        })
                })
                .catch(err => {
                    console.error(err);
                });
        });
    });
    afterEach(function () {
        return new Promise((resolve, reject) => {
            mongoose.connection.dropDatabase()
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    console.error(err);
                    reject(err);
                });
        });
    });
    it('Should return user blog', function() {
        return chai.request(app)
            .get('/api/blog')
            .set('Authorization', `Bearer ${jwtToken}`)
            .then(res => {
                expect(res).to.have.status(HTTP_STATUS_CODES.OK);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const blog = res.body[0];
                expect(blog).to.include.keys('user', 'title', 'content');
                expect(blog.user).to.be.a('object');
                expect(blog.user).to.include.keys('name', 'email', 'username');
                expect(blog.user).to.deep.include({
                    id: fakeUser.id,
                    username: fakeUser.username,
                    email: fakeUser.email,
                    name: fakeUser.name
                });
            });
    });
    it('Should return a specific blog', function () {
        let foundBlog;
        return Blog.find()
            .then(blogs => {
                expect(blogs).to.be.a('array');
                expect(blogs).to.have.lengthOf.at.least(1);
                foundBlog = blogs[0];

                return chai.request(app)
                    .get(`/api/blog/${foundBlog.id}`)
                    .set('Authorization', `Bearer ${jwtToken}`);
            })
            .then(res => {
                expect(res).to.have.status(HTTP_STATUS_CODES.OK);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('user', 'title', 'content');
                expect(res.body).to.deep.include({
                    id: foundBlog.id,
                    title: foundBlog.title,
                    content: foundBlog.content
                });
            });
    });

    it('Should update a specific blog', function () {
        let blogToUpdate;
        const newBlogData = createFakerBlog();
        return Blog.find()
            .then(blogs => {
                expect(blogs).to.be.a('array');
                expect(blogs).to.have.lengthOf.at.least(1);
                blogToUpdate = blogs[0];

                return chai.request(app)
                    .put(`/api/blog/${blogToUpdate.id}`)
                    .set('Authorization', `Bearer ${jwtToken}`)
                    .send(newBlogData);
            })
            .then(res => {
                expect(res).to.have.status(HTTP_STATUS_CODES.NO_CONTENT);

                return Blog.findById(blogToUpdate.id);
            })
            .then(blog => {
                expect(blog).to.be.a('object');
                expect(blog).to.deep.include({
                    id: blogToUpdate.id,
                    title: newBlogData.title,
                    content: newBlogData.content
                });
            });
    });

    it('Should delete a specific blog', function () {
        let blogToDelete;
        return Blog.find()
            .then(blogs => {
                expect(blogs).to.be.a('array');
                expect(blogs).to.have.lengthOf.at.least(1);
                blogToDelete = blogs[0];

                return chai.request(app)
                    .delete(`/api/blog/${blogToDelete.id}`)
                    .set('Authorization', `Bearer ${jwtToken}`);
            })
            .then(res => {
                expect(res).to.have.status(HTTP_STATUS_CODES.NO_CONTENT);

                return Blog.findById(blogToDelete.id);
            })
            .then(blog => {
                expect(blog).to.not.exist;
            });
    });
    function createFakerUser() {
        return {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            username: `${faker.lorem.word()}${faker.random.number(100)}`,
            password: faker.internet.password(),
            email: faker.internet.email()
        };
    };
    function createFakerBlog() {
        return {
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs()
        };
    }
});