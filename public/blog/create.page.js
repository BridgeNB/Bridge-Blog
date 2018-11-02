'use strict';
const HTTP = window.HTTP_MODULE;
const CACHE = window.CACHE_MODULE;

let STATE = {};

$(document).ready(onReady);

function onReady() {
    STATE.authorizedUser = CACHE.getAuthenticatedUserFromCache();
    realTimeConvertToMarkdown();
    $('#new-blog-form').on('submit', onCreateSubmit);
}

function onCreateSubmit(event) {
    event.preventDefault();
    const newBlog = {
        title: $('#title-txt').val(),
        content: $('#content-txt').val(),
        tag: $('#tag-txt').val(),
        commits: $('#comments-txt').val()
    };
    HTTP.createBlog({
        jwtToken: STATE.authorizedUser.jwtToken,
        newBlog: newBlog,
        onSuccess: blog => {
            alert('Blog created, redirecting ...');
            window.open(`/blog/details.html?id=${blog.id}`, '_self');
        },
        onError: err => {
            alert('Internal Server Error (see console)');
            console.error(err);
        }
    });
}

function realTimeConvertToMarkdown() {
    let converter = new showdown.Converter();
    let pad = $('#content-txt');
    let markdownArea = $('#markdown-target-div');


    let convertTextAreaToMarkdown = function() {
        let html = converter.makeHtml(pad.val());
        console.log(html);
        markdownArea.html(html);
    };

    pad.on('keyup keydown', convertTextAreaToMarkdown);
}
