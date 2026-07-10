document.addEventListener('DOMContentLoaded', () => {
    // --- MODERN STİL ENJEKSİYONU ---
    const style = document.createElement('style');
    style.innerHTML = `
        .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; padding: 20px; }
        .feature-card { background: #121212; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; transition: 0.3s; opacity: 0; }
        .feature-card.visible { opacity: 1; }
        .feature-card:hover { border-color: #444; transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
        .feature-card h3 { padding: 15px; margin: 0; color: #e0e0e0; font-family: sans-serif; font-size: 1.1rem; }
        .video-wrapper { position: relative; cursor: pointer; background: #000; width: 100%; height: 250px; overflow: hidden; }
        .video-wrapper img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .play-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-size: 50px; color: white; background: rgba(0,0,0,0.4); border: 2px solid rgba(255,255,255,0.8); border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
        .video-wrapper:hover .play-icon { background: rgba(255,0,0,0.7); border-color: white; }
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

    // --- ARAMA MOTORU İÇİN ORTAK DEĞİŞKENLER ---
    let allPosts = [];
    let allVideos = [];

    // --- İNDİRMELER SİSTEMİ ---
    if (blogWrapper) {
        fetch('indir.json?t=' + new Date().getTime())
            .then(res => res.json())
            .then(data => {
                if(data.adminConfig.canPost) {
                    allPosts = data.indir.filter(p => p.active !== false);
                    renderPosts(allPosts);
                }
            });
    }

    // --- VİDEO SİSTEMİ ---
    if (videoContainer) {
        fetch('videos.json?t=' + new Date().getTime())
            .then(res => res.json())
            .then(data => {
                allVideos = data;
                renderVideos(allVideos);
            });
    }

    // --- CANLI ARAMA DİNLEYİCİSİ ---
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase().trim();

            // İndirmeleri filtrele
            if (blogWrapper) {
                const filteredPosts = allPosts.filter(p => p.title.toLowerCase().includes(val));
                blogWrapper.innerHTML = "";
                filteredPosts.length > 0 ? renderPosts(filteredPosts) : blogWrapper.innerHTML = "<p style='color:#b0bec5; padding:20px;'>Sonuç bulunamadı.</p>";
            }

            // Videoları filtrele
            if (videoContainer) {
                const filteredVideos = allVideos.filter(v => v.title.toLowerCase().includes(val));
                videoContainer.innerHTML = "";
                renderVideos(filteredVideos);
            }
        });
    }

    function renderPosts(posts) {
        posts.forEach((p, i) => {
            const card = document.createElement('div');
            card.className = 'post-card';
            card.innerHTML = `<h3>${p.title}</h3><p>${p.content}</p><a href="${p.downloadLink}" class="btn-download" target="_blank">📁 ${p.fileName} İndir</a>`;
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
            setTimeout(() => card.classList.add('visible'), i * 100);
        });
    }
});
