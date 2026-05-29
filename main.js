document.addEventListener('DOMContentLoaded', () => {
    const blogWrapper = document.getElementById('blog-wrapper');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    if (blogWrapper) {
        fetch('posts.json')
            .then(response => response.json())
            .then(data => {
                if(data.adminConfig.canPost) {
                    renderPosts(data.posts);
                } else {
                    blogWrapper.innerHTML = "<p>İçeriklere erişim yetkiniz yok.</p>";
                }
            })
            .catch(err => {
                console.error("Veri yüklenemedi:", err);
                blogWrapper.innerHTML = "<p>İçerik şu an yüklenemiyor.</p>";
            });
    }

    function renderPosts(posts) {
        posts.forEach((post, index) => {
            const card = document.createElement('div');
            card.className = 'post-card';
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 200);

            const downloadButtonText = post.fileName ? `📁 ${post.fileName} İndir` : "🔗 Bağlantıya Git";

            card.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <small style="display:block; margin-bottom:15px; color:#555;">${post.date}</small>
                <a href="${post.downloadLink}" class="btn-download" target="_blank">${downloadButtonText}</a>
            `;
            blogWrapper.appendChild(card);
        });
    }
});
