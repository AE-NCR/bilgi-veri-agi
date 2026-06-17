document.addEventListener('DOMContentLoaded', () => {
    const blogWrapper = document.getElementById('blog-wrapper');
    const videoContainer = document.getElementById('video-container'); // Videolar için eklendi
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const searchInput = document.getElementById('search-input');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- MEVCUT İNDİRMELER KODU ---
    if (blogWrapper) {
        fetch('indir.json?t=' + new Date().getTime())
            .then(response => response.json())
            .then(data => {
                if(data.adminConfig.canPost) {
                    const activePosts = data.indir.filter(post => post.active !== false);
                    renderPosts(activePosts);
                    
                    if (searchInput) {
                        searchInput.addEventListener('input', (e) => {
                            const searchTerm = e.target.value.toLowerCase().trim();
                            const filteredPosts = data.indir.filter(post => 
                                post.active !== false && 
                                post.title.toLowerCase().includes(searchTerm)
                            );
                            blogWrapper.innerHTML = "";
                            if (filteredPosts.length > 0) {
                                renderPosts(filteredPosts);
                            } else {
                                blogWrapper.innerHTML = "<p style='color: #b0bec5; grid-column: 1/-1;'>Aradığınız kriterlere uygun içerik bulunamadı.</p>";
                            }
                        });
                    }
                } else {
                    blogWrapper.innerHTML = "<p>İçeriklere erişim yetkiniz yok.</p>";
                }
            })
            .catch(err => {
                console.error("Veri yüklenemedi:", err);
                blogWrapper.innerHTML = "<p>İçerik şu an yüklenemiyor.</p>";
            });
    }

    // --- YENİ VİDEO SİSTEMİ KODU ---
    if (videoContainer) {
        fetch('videos.json?t=' + new Date().getTime())
            .then(response => response.json())
            .then(data => {
                renderVideos(data);
                window.filterVideos = (category) => {
                    const filtered = category === 'Hepsi' ? data : data.filter(v => v.category === category);
                    videoContainer.innerHTML = "";
                    renderVideos(filtered);
                };
            })
            .catch(err => {
                console.error("Video yüklenemedi:", err);
                videoContainer.innerHTML = "<p>Videolar şu an yüklenemiyor.</p>";
            });
    }

    function renderPosts(posts) {
        posts.forEach((post, index) => {
            const card = document.createElement('div');
            card.className = 'post-card';
            setTimeout(() => { card.classList.add('visible'); }, index * 150);
            const isLinkValid = post.downloadLink && post.downloadLink !== "#";
            const buttonText = isLinkValid ? `📁 ${post.fileName} İndir` : "🔗 İndirme bağlantısı bulunmamaktadır.";
            card.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <small style="display:block; margin-bottom:15px; color:#555;">${post.date}</small>
                <a href="${post.downloadLink}" class="btn-download" ${isLinkValid ? 'target="_blank"' : ''}>${buttonText}</a>
            `;
            blogWrapper.appendChild(card);
        });
    }

    function renderVideos(videos) {
        videos.forEach((video, index) => {
            const card = document.createElement('div');
            card.className = 'feature-card';
            card.style.opacity = '0';
            card.style.transition = 'opacity 0.5s ease';
            card.innerHTML = `
                <h3>${video.title}</h3>
                <iframe src="${video.link}" width="100%" height="250" frameborder="0" allowfullscreen></iframe>
            `;
            videoContainer.appendChild(card);
            setTimeout(() => { card.style.opacity = '1'; }, index * 100);
        });
    }
});
