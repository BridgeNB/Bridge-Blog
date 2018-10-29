'use strict';
const express = require('express');
const Joi = require('joi');
const blogRouter = express.Router();

const { HTTP_STATUS_CODES } = require('../config.js');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { Blog, BlogJoiSchema } = require('./blog.model.js');

blogRouter.post('/', jwtPassportMiddleware, (req, res) => {
    const newBlog = {
        user: req.user.id,
        title: req.body.title,
        content: req.body.content,
        createDate: Date.now(),
        tag: req.body.tag,
        comments: req.body.comments
    };
    const validation = Joi.validate(newBlog, BlogJoiSchema);
    if (validation.error) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    Blog.create(newBlog)
        .then(createdBlog => {
            return res.status(HTTP_STATUS_CODES.CREATED).json(createdBlog.serialize());
        })
        .catch(error => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        })
})

blogRouter.get('/', jwtPassportMiddleware, (req, res) => {
    Blog.find({ user: req.user.id })
        .populate('user')
        .then(blogs => {
            return res.status(HTTP_STATUS_CODES.OK).json(
                blogs.map(blog => blog.serialize())
            );
        })
        .catch(error => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

blogRouter.get('/:blogid', (req, res) => {
    Blog.findById(req.params.blogid)
    .populate('user')
    .then(blog => {
        return res.status(HTTP_STATUS_CODES.OK).json(blog.serialize());
    })
    .catch(error => {
        return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
    });
});

blogRouter.put('/:blogid', jwtPassportMiddleware, (req, res) => {
    const blogUpdate = {
        title: req.body.title,
        content: req.body.content
    };
    const validation = Joi.validate(blogUpdate, BlogJoiSchema);
    if(validation.error) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    Blog.findByIdAndUpdate(req.params.blogid, blogUpdate)
        .then(() => {
            return res.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch((error) => {
            return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        })
})

blogRouter.delete('/:blogid', (req, res) => {
    Blog.findByIdAndDelete(req.params.blogid)
        .then(() => {
            return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        })
})



module.exports = { blogRouter };