'use strict';
const HTTP = window.HTTP_MODULE;
const CACHE = window.CACHE_MODULE;
const RENDER = window.RENDER_MODULE;
const HELPER = window.HELPER_MODULE;

let STATE = {};

$(document).ready(onReady);

function onReady() {
    STATE.blogid = HELPER.getQueryStringParam('id');
    STATE.authUser = CACHE.getAuthenticatedUserFromCache();

    HTTP.getBlogById({
        blogid: STATE.blogid,
        onSuccess: RENDER.renderBlogDetails
    });
}