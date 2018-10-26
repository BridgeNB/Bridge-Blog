const mongoose = require('mongoose');
const Joi = require('joi');

const blogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    title: { type: String, required: true },
    content: { type: String, required: true },
    createDate: { type: Date },
    updateDate: { type: Date, default: Date.now },
    tag: {type: String},
    comments: {type: String}
})

blogSchema.methods.serialize = function () {
    let user;
    if (tyypeof (this.user.serialize) === 'function'){
        user = this.user.serialize();
    } else {
        user = this.user;
    }

    return {
        id: this._id,
        user: user,
        title: this.title,
        content: this.content,
        createDate: this.createDate,
        updateDate: this.updateDate,
        tag: this.tag,
        comments: this.comments
    };
};



const BlogJoiSchema = Joi.object().keys({
    user: Joi.string().optional(),
    title: Joi.string().min(1).required(),
    content: Joi.string().min(1).required(),
    createDate: Joi.date().timestamp(),
    tag: Joi.string().optional(),
    comments: Joi.string().optional()
})

const Blog = mongoose.model('blog', blogSchema);
module.exports = { Blog, BlogJoiSchema };