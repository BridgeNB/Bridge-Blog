window.RENDER_MODULE = {
    renderBlogList,
    renderBlogDetails,
    renderEditedBlog
}

function renderBlogList() {

}

function renderBlogDetails(blog) {
    $('#blog-details').html(`
        <br>
        <h1>${$blog.title}</h1>
        <i>${$blog.user.name} | ${new Date(blog.updateDate).toLocaleString()}</i>
        <p>${$blog.content}</p>
    `);
}

function renderEditedBlog() {
    
}