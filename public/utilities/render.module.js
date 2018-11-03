window.RENDER_MODULE = {
    renderBlogsList,
    renderBlogDetails,
    renderEditingBlog
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
        // Convert to markdonw
        let markdownBlogHtml = realTimeMarkdownRendering(blogSummary); 
        return `
        <div id="blog-card" data-blog-id="${blog.id}">
            <h3 class="blog-header">${blog.title}</h3>
            <div class="blog-content">${markdownBlogHtml}</div>
            <p class="blog-info">
                <i>${blog.user.name} | Last update on ${new Date(blog.updateDate).toLocaleDateString()}</i>
            </p>
            <button id="delete-blog-btn">Delete</button>
        </div>
        `;
    }
}

function renderBlogDetails(blog) {
    let html = realTimeMarkdownRendering(blog.content);
    $('#blog-details').html(`
        <br>
        <h1>${blog.title}</h1>
        <i>${blog.user.name} | ${new Date(blog.updateDate).toLocaleDateString()}</i>
        <div class="blog-content">${html}</div>
        <button id="edit-blog-btn" onclick="window.location.href='/blog/edit.html?id=${blog.id}'">Edit</button>
    `);
}

function renderEditingBlog(blog) {
    $('#title-txt').prop('disabled', false).val(blog.title);
    $('#content-txt').prop('disabled', false).val(blog.content);
    $('#markdown-target-div').html(realTimeMarkdownRendering(blog.content));
}

function realTimeMarkdownRendering(textString) {
    let converter = new showdown.Converter();
    let html = converter.makeHtml(textString);
    return html;
}