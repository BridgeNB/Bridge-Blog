'use strict';
window.HTTP_MODULE = {
    signupUser,
    loginUser,
    createBlog,
    getBlogById,
    getBlogsByUser,
    updateBlog
};

function signupUser(options) {
    const { userData, onSuccess, onError } = options;
    $.ajax({
        type: 'POST',
        url: '/api/user',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(userData),
        success: onSuccess,
        error: err => {
            console.error(log);
            if (onError) {
                onError(err);
            }
        }
    });
}

function loginUser(options) {
    const { userData, onSuccess, onError } = options;
    $.ajax({
        type: 'POST',
        url: '/api/auth/login',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(userData),
        success: onSuccess,
        error: err => {
            console.log(err);
            if (onError) {
                onError(err);
            }
        }
    });
}

function createBlog(options) {
    const { jwtToken, newBlog , onSuccess, onError } = options;
    $.ajax({
        type: 'POST',
        url: '/api/blog',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(newBlog),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwtToken}`);
        },
        success: onSuccess,
        error: err => {
            console.log(err);
            if(onError) {
                onError(err);
            }
        }
    });
}

function getBlogById(options) {
    const { blogid, onSuccess } = options;
    $.getJSON(`/api/blog/${blogid}`, onSuccess);
}

function getBlogsByUser(options) {
    const { jwtToken, onSuccess, onError } = options;
    $.ajax({
        type: 'GET',
        url: '/api/blog',
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwtToken}`);
        },
        success: onSuccess,
        error: err => {
            console.log(err);
            if (onError) {
                onError(err);
            }
        }
    })
}

function updateBlog(options) {
    const { blogid, jwtToken, newBlog, onSuccess, onError } = options;
    $.ajax({
        type: 'PUT',
        url: `/api/blog/${blogid}`,
        contentType: 'application/json',
        datatype: 'json',
        data: JSON.stringify(newBlog),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwtToken}`);
        },
        success: onSuccess,
        error: err => {
            console.log(err);
            if(onError) {
                onError(err);
            }
        }
    });
}