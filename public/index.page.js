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

    $('#blogs-list').on('click', '#blog-card', onBlogClicked);
    $('#blogs-list').on('click', '#delete-blog-btn', onDeleteBlogBtnClick);
    $('#logout-btn').on('click', onLogoutBtnClick);
}

function updateAuthenticatedUI() {
    const authUser = CACHE.getAuthenticatedUserFromCache();
    if (authUser) {
        STATE.authUser = authUser;
        $('#nav-greeting').html(`Welcome, ${authUser.name}`);
        $('#auth-menu').removeAttr('hidden');
        $('#default-page-nav').css('padding-top', '0');
    } else {
        $('#default-menu').removeAttr('hidden');
        $('#nav-btns').removeAttr('hidden');
    }
}

function onBlogClicked(event) {
    const blogid = $(event.currentTarget).attr('data-blog-id');
    window.open(`/blog/details.html?id=${blogid}`, '_self');
}

function onDeleteBlogBtnClick(event) {
    event.stopImmediatePropagation();
    const blogid = $(event.currentTarget)
        .closest('#blog-card')
        .attr('data-blog-id');
    const userConfirm = confirm('Are you sure to delete this blog');
    if(userConfirm){
        HTTP.deleteBlog({
            blogid: blogid,
            jwtToken: STATE.authUser.jwtToken,
            onSuccess: () => {
                alert('Note deleted successfully, redirect to home page...');
                HTTP.getBlogsByUser({
                    jwtToken: STATE.authUser.jwtToken,
                    onSuccess: RENDER.renderBlogsList
                });
            },
            onError: err => {
                alert('Internal Server Error (see console)!');
                console.error(err);
            }
        });
    }
}

function onLogoutBtnClick(event) {
    const confirmation = confirm('Are you sure you want to logout?');
    if (confirmation) {
        CACHE.deleteAuthenticatedUserFromCache();
        window.open('/auth/login.html', '_self');
    }
}
