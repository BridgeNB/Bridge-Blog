'use strict';

let STATE = {};

const RENDER = window.RENDER_MODULE;
const CACHE  = window.CACHE_MODULE;
const HTTP   = window.HTTP_MODULE;

$(document).ready(onPageLoad);

function onPageLoad() {
    updateAuthenticatedUI();

    if (STATE.authUser) {
        HTTP.getBlogsByUser({
            jwtToken: STATE.authUser.jwtToken,
            onSuccess: RENDER.renderBlogsList
        });
    }
}

function updateAuthenticatedUI() {
    const authUser = CACHE.getAuthenticatedUserFromCache();
    if (authUser) {
        STATE.authUser = authUser;
        $('#nav-greeting').html(`Welcome, ${authUser.name}`);
        $('#auth-menu').removeAttr('hidden');
    } else {
        $('#default-menu').removeAttr('hidden');
    }
}