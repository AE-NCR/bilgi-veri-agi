document.addEventListener('DOMContentLoaded', () => {
    // --- MODERN STİLLERİ ENJEKTE ET ---
    const style = document.createElement('style');
    style.innerHTML = `
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 25px;
            padding: 20px;
        }
        .feature-card {
            background: #121212;
            border: 1px solid #2a2a2a;
            border-radius: 12px;
            overflow: hidden;
            transition: 0.3s;
        }
        .feature-card:hover {
            border-color: #444;
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        }
        .feature-card h3 {
            padding: 15px;
            margin: 0;
            color: #e0e0e0;
            font-family: sans-serif;
            font-size: 1.1rem;
        }
        .play-icon {
            background: rgba(0,0,0,0.4);
            border: 2px solid rgba(255,255,255,0.8);
            border-radius: 50%;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            transition: 0.3s;
        }
        .video-wrapper:hover .play-icon {
            background: rgba(255,0,0,0.7);
            border-color: white;
        }
    `;
    document.head.appendChild(style);

    const blogWrapper = document.getElementById('blog-wrapper');
    const videoContainer = document.getElementById('video-container');
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
                <div class="video-wrapper" style="position:relative; cursor:pointer; background:#000;" 
                     onclick="this.innerHTML='<iframe src=\\'${video.link}?autoplay=1\\' width=\\'100%\\' height=\\'250\\' frameborder=\\'0\\' allowfullscreen></iframe>'">
                    <img src="${video.thumbnail}" style="width:100%; height:250px; object-fit:cover; display:block;">
                    <div class="play-icon" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:50px;">▶</div>
                </div>
            `;
            videoContainer.appendChild(card);
            setTimeout(() => { card.style.opacity = '1'; }, index * 100);
        });
    }
});
