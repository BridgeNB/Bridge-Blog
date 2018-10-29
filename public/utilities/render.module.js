window.RENDER_MODULE = {
    renderBlogsList,
    renderBlogDetails,
    renderEditedBlog
}

function renderBlogsList(blogs) {
    const blogsHtml = blogs.map(blogToHtml).join('<hr/>');
    $('#blogs-list').html(blogsHtml);
    function blogToHtml(blog) {
        let blogSummary = blog.content;
        if (blogSummary.length > 120) {
            blogSummary = `${blog.content.substring(0, 120)}...`;
        }
        // Tag needed
        return `
        <div id='blog-card" data-blog-id="${blog.id}">
            <h3 class="blog-header">${blog.title}
            <button id="delete-blog-btn">Delete</button></h3>
            <p class="blog-content>${blogSummary}</p>
            <p class="blog-info">
                <i>${blog.user.name} | Last update on ${new Date(blog.updateDate).toLocaleDateString()}</i>
            </p>
        </div>
        `;
    }
}

function renderBlogDetails(blog) {
    $('#blog-details').html(`
        <br>
        <h1>${blog.title}</h1>
        <i>${blog.user.name} | ${new Date(blog.updateDate).toLocaleDateString()}</i>
        <p>${blog.content}</p>
    `);
}

function renderEditedBlog() {
    
}

