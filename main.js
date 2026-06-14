document.addEventListener('DOMContentLoaded', () => {
    const blogWrapper = document.getElementById('blog-wrapper');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const searchInput = document.getElementById('search-input'); // Arama kutusu bağlantısı

    // Hamburger Menü Kontrolü
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // JSON Verisini Çekme ve Listeleme
    if (blogWrapper) {
        fetch('indir.json')
            .then(response => response.json())
            .then(data => {
                if(data.adminConfig.canPost) {
                    // Sayfa ilk açıldığında tüm postları listele
                    renderPosts(data.indir);
                    
                    // Arama kutusuna her harf girildiğinde çalışacak alan
                    if (searchInput) {
                        searchInput.addEventListener('input', (e) => {
                            // Aranan kelimeyi tamamen küçük harfe çeviriyoruz
                            const searchTerm = e.target.value.toLowerCase().trim();
                            
                            // Postları süzüyoruz (Hem başlığı hem aranan kelimeyi küçük harfe çevirerek eşleştiriyoruz)
                            const filteredPosts = data.posts.filter(post => 
                                post.title.toLowerCase().includes(searchTerm)
                            );
                            
                            // Mevcut listeyi temizle
                            blogWrapper.innerHTML = "";
                            
                            // Sonuç varsa yazdır, yoksa uyarı mesajı ver
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

    function renderPosts(posts) {
        posts.forEach((post, index) => {
            const card = document.createElement('div');
            card.className = 'post-card';
            
            // Kartların ekrana yumuşak gelme animasyonu süresi
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 150);

            // Eğer indirme linki boşsa veya # ise farklı buton metni göster
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
});
