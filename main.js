document.addEventListener('DOMContentLoaded', () => {
    // --- TASARIM ENJEKSİYONU ---
    const style = document.createElement('style');
    style.innerHTML = `
        .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; padding: 20px; }
        .feature-card { background: #121212; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; transition: 0.3s; }
        .feature-card:hover { border-color: #555; transform: translateY(-5px); }
        .feature-card h3 { padding: 12px; margin: 0; color: #fff; font-size: 1rem; }
        .video-wrapper { position: relative; cursor: pointer; aspect-ratio: 16/9; overflow: hidden; }
        .video-wrapper img { width: 100%; height: 100%; object-fit: cover; }
        .play-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-size: 40px; color: white; opacity: 0.8; pointer-events: none; }
    `;
    document.head.appendChild(style);

    const blogWrapper = document.getElementById('blog-wrapper');
    const videoContainer = document.getElementById('video-container');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const searchInput = document.getElementById('search-input');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    // --- İNDİRMELER SİSTEMİ ---
    if (blogWrapper) {
        fetch('indir.json?t=' + new Date().getTime())
            .then(res => res.json())
            .then(data => {
                if(data.adminConfig.canPost) {
                    renderPosts(data.indir.filter(p => p.active !== false));
                    if (searchInput) {
                        searchInput.addEventListener('input', (e) => {
                            const val = e.target.value.toLowerCase();
                            blogWrapper.innerHTML = "";
                            const filtered = data.indir.filter(p => p.active !== false && p.title.toLowerCase().includes(val));
                            filtered.length > 0 ? renderPosts(filtered) : blogWrapper.innerHTML = "<p>Sonuç bulunamadı.</p>";
                        });
                    }
                } else {
                    blogWrapper.innerHTML = "<p>Erişim yetkiniz yok.</p>";
                }
            });
    }

    // --- VİDEO SİSTEMİ ---
    if (videoContainer) {
        fetch('videos.json?t=' + new Date().getTime())
            .then(res => res.json())
            .then(data => {
                renderVideos(data);
                window.filterVideos = (cat) => {
                    videoContainer.innerHTML = "";
                    renderVideos(cat === 'Hepsi' ? data : data.filter(v => v.category === cat));
                };
            });
    }

    function renderPosts(posts) {
        posts.forEach((p, i) => {
            const card = document.createElement('div');
            card.className = 'post-card';
            card.innerHTML = `<h3>${p.title}</h3><p>${p.content}</p><a href="${p.downloadLink}" class="btn-download" target="_blank">📁 İndir</a>`;
            blogWrapper.appendChild(card);
            setTimeout(() => card.classList.add('visible'), i * 100);
        });
    }

    function renderVideos(videos) {
        videos.forEach((v, i) => {
            const card = document.createElement('div');
            card.className = 'feature-card';
            card.innerHTML = `
                <h3>${v.title}</h3>
                <div class="video-wrapper" onclick="this.innerHTML='<iframe src=\\'${v.link}?autoplay=1\\' width=\\'100%\\' height=\\'100%\\' frameborder=\\'0\\' allowfullscreen></iframe>'">
                    <img src="${v.thumbnail}" loading="lazy">
                    <div class="play-icon">▶</div>
                </div>
            `;
            videoContainer.appendChild(card);
        });
    }
});
