'use strict';
const HTTP = window.HTTP_MODULE;
const CACHE = window.CACHE_MODULE;
const RENDER = window.RENDER_MODULE;
const ETC = window.HELPER_MODULE;

let STATE = {};

$(document).ready(onReady);

function onReady() {
    STATE.blogid = ETC.getQueryStringParam('id');
    STATE.authUser = CACHE.getAuthenticatedUserFromCache();

    HTTP.getBlogById({
        blogId: STATE.blogid,
        onSuccess: RENDER.renderBlogDetails
    });
}