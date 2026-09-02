// ===== 0. بارگذاری هدر و فوتر مشترک از فایل‌های جدا =====
async function loadPartial(url, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('پاسخ نامعتبر برای ' + url);
        container.innerHTML = await res.text();
    } catch (error) {
        console.log('خطا در بارگذاری بخش مشترک سایت:', url, error);
    }
}

// مشخص کردن لینک فعال منو بر اساس صفحه‌ی جاری
function setActiveNavLink() {
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link[href]').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            const dropdownParent = link.closest('.dropdown');
            if (dropdownParent) {
                const toggle = dropdownParent.querySelector('.dropdown__toggle');
                if (toggle) toggle.classList.add('active');
            }
        }
    });
}

// ===== 1 و 2. هَمبَرگِر و بستن منو در موبایل =====
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburgerBtn');
    const mainNav = document.getElementById('mainNav');

    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mainNav.classList.toggle('open');
        });
    }

    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // لینک «نمونه کارها» خودش زیرمنو رو باز/بسته می‌کنه،
            // پس نباید کل منوی موبایل رو ببنده
            if (link.classList.contains('dropdown__toggle')) {
                return;
            }
            if (window.innerWidth <= 768 && hamburger && mainNav) {
                hamburger.classList.remove('active');
                mainNav.classList.remove('open');
            }
        });
    });
}

// ===== 3. ساب‌منو در موبایل =====
function initDropdownMenu() {
    const dropdownToggles = document.querySelectorAll('.dropdown__toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = toggle.closest('.dropdown');
                if (parent) {
                    parent.classList.toggle('open');
                }
            }
        });
    });
}

// ===== 4. افکت اسکرول =====
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// ===== سال فوتر =====
function initFooterYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// اجرای همه‌ی موارد وابسته به هدر/فوتر بعد از بارگذاری موفق آن‌ها
async function loadHeaderFooter() {
    await Promise.all([
     loadPartial('public/header.html', 'site-header'),
     loadPartial('public/footer.html', 'site-footer')
    ]);
    setActiveNavLink();
    initHamburgerMenu();
    initDropdownMenu();
    initHeaderScrollEffect();
    initFooterYear();
}

document.addEventListener('DOMContentLoaded', () => {
    loadHeaderFooter();

    // ===== 5. باکس‌های موسیقی =====
    const musicCards = document.querySelectorAll('.music-card');

    musicCards.forEach(card => {
        card.addEventListener('click', function () {
            const title = this.querySelector('.music-card__title')?.textContent || '';
            const artist = this.querySelector('.music-card__artist')?.textContent || '';

            try {
                localStorage.setItem('lastPlayed', JSON.stringify({
                    title: title,
                    artist: artist,
                    time: new Date().toLocaleString()
                }));
            } catch (error) {
                console.log('خطا در ذخیره‌سازی:', error);
            }
        });
    });

    // ===== 6. لایت‌باکس گالری نمونه‌کار =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (lightbox && lightboxImg) {
        portfolioCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                const title = card.querySelector('.portfolio-card__title')?.textContent || '';
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                if (lightboxCaption) lightboxCaption.textContent = title;
                lightbox.classList.add('open');
            });
        });

        const closeLightbox = () => lightbox.classList.remove('open');

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    } else {
        // در صفحه‌ی اصلی لایت‌باکس وجود نداره؛ کارت‌های نمونه‌کار به صفحه‌ی مربوطه هدایت می‌شن
        document.querySelectorAll('.portfolio-card[data-href]').forEach(card => {
            card.addEventListener('click', () => {
                window.location.href = card.dataset.href;
            });
        });
    }

    // ===== 7. فرم تماس (بدون بک‌اند، فقط نمایش پیام موفقیت) =====
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formStatus.textContent = 'پیام شما با موفقیت ثبت شد. به‌زودی با شما تماس می‌گیریم.';
            formStatus.classList.add('success');
            contactForm.reset();
        });
    }

    // ===== 8. صفحه‌ی آلبوم (album.html) =====
    initAlbumPage();

    // ===== 9. صفحه‌ی پخش هر قطعه (player-1.html ... player-6.html) =====
    initPlayerPage();
});

// ===== دادهٔ آلبوم‌ها: عنوان، هنرمند، کاور و لیست قطعات هر آلبوم =====
// این اطلاعات فقط برای نمایش لیست قطعات در صفحه‌ی آلبوم استفاده می‌شود.
// متن شعر و فایل صوتی هر قطعه داخل همان فایل player-N.html مربوط به آن آلبوم است.
const ALBUMS = {
    1: {
        title: 'هفت خان رستم',
        artist: 'شاهنامه فردوسی',
        cover: 'public/img/4956-450x450.jpg',
        description: 'روایت صوتی هفت خان رستم در شاهنامه‌ی فردوسی.',
        playerPage: 'player/HaftKhan.html',
        tracks: [
            { id: 1, title: 'خان اول' },
            { id: 2, title: 'خان دوم' },
            { id: 3, title: 'خان سوم' },
            { id: 4, title: 'خان چهارم' },
            { id: 5, title: 'خان پنجم' },
            { id: 6, title: 'خان ششم' },
            { id: 7, title: 'خان هفتم' }
        ]
    },
    2: {
        title: 'رؤیاهای شهری',
        artist: 'خواننده: سارا احمدی',
        cover: 'public/img/4956-450x450.jpg',
        description: 'روایتی صوتی از شب‌های شهر و رؤیاهایی که در آن جریان دارند.',
        playerPage: 'player-2.html',
        tracks: [
            { id: 1, title: 'قطعه اول' },
            { id: 2, title: 'قطعه دوم' },
            { id: 3, title: 'قطعه سوم' }
        ]
    },
    3: {
        title: 'شب‌های بی‌خوابی',
        artist: 'خواننده: علی کریمی',
        cover: 'public/img/4956-450x450.jpg',
        description: 'قطعاتی برای شب‌هایی که خواب به چشم نمی‌آید.',
        playerPage: 'player-3.html',
        tracks: [
            { id: 1, title: 'قطعه اول' },
            { id: 2, title: 'قطعه دوم' },
            { id: 3, title: 'قطعه سوم' }
        ]
    },
    4: {
        title: 'طبیعت و صدا',
        artist: 'خواننده: نرگس محمدی',
        cover: 'public/img/4956-450x450.jpg',
        description: 'ترکیبی از صداهای طبیعت و ملودی‌های آرام.',
        playerPage: 'player-4.html',
        tracks: [
            { id: 1, title: 'قطعه اول' },
            { id: 2, title: 'قطعه دوم' },
            { id: 3, title: 'قطعه سوم' }
        ]
    },
    5: {
        title: 'ضربان قلب',
        artist: 'خواننده: حسین نوروزی',
        cover: 'public/img/4956-450x450.jpg',
        description: 'قطعاتی پرانرژی با ریتمی که ضربان قلب را بالا می‌برد.',
        playerPage: 'player-5.html',
        tracks: [
            { id: 1, title: 'قطعه اول' },
            { id: 2, title: 'قطعه دوم' },
            { id: 3, title: 'قطعه سوم' }
        ]
    },
    6: {
        title: 'سفر به یادها',
        artist: 'خواننده: زهرا موسوی',
        cover: 'public/img/4956-450x450.jpg',
        description: 'سفری صوتی در دل خاطرات، همراه با کلامی نوستالژیک.',
        playerPage: 'player-6.html',
        tracks: [
            { id: 1, title: 'قطعه اول' },
            { id: 2, title: 'قطعه دوم' },
            { id: 3, title: 'قطعه سوم' }
        ]
    }
};

// ===== ساخت صفحه‌ی آلبوم بر اساس شناسه‌ی موجود در آدرس (album.html?id=N) =====
function initAlbumPage() {
    const albumTitleEl = document.getElementById('albumTitle');
    if (!albumTitleEl) return; // یعنی این صفحه، صفحه‌ی آلبوم نیست

    const params = new URLSearchParams(window.location.search);
    const albumId = params.get('id');
    const album = ALBUMS[albumId];

    const coverEl = document.getElementById('albumCover');
    const artistEl = document.getElementById('albumArtist');
    const descEl = document.getElementById('albumDescription');
    const tracksEl = document.getElementById('albumTracks');

    if (!album) {
        albumTitleEl.textContent = 'این آلبوم پیدا نشد';
        if (artistEl) artistEl.textContent = '';
        if (descEl) descEl.textContent = 'به لیست آلبوم‌ها برگرد و یکی را انتخاب کن.';
        return;
    }

    if (coverEl) {
        coverEl.src = album.cover;
        coverEl.alt = album.title;
    }
    albumTitleEl.textContent = album.title;
    if (artistEl) artistEl.textContent = album.artist;
    if (descEl) descEl.textContent = album.description;

    if (tracksEl) {
        tracksEl.innerHTML = '';
        album.tracks.forEach(track => {
            const link = document.createElement('a');
            link.className = 'track-card';
            link.href = `${album.playerPage}?id=${track.id}`;
            link.innerHTML = `
                <span class="track-card__icon"><i class="bi bi-play-circle-fill"></i></span>
                <span class="track-card__title">${track.title}</span>
            `;
            tracksEl.appendChild(link);
        });
    }
}

// ===== پخش قطعه در صفحه‌ی اختصاصی هر آلبوم (player-N.html) =====
// هر فایل player-N.html پیش از فراخوانی script.js، یک شیء TRACKS مخصوص به خودش تعریف می‌کند.
function initPlayerPage() {
    const playerContainer = document.getElementById('playerContainer');
    if (!playerContainer) return;
    if (typeof TRACKS === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const trackId = params.get('id');
    const track = TRACKS[trackId];

    const titleEl = document.getElementById('playerTitle');
    const artistEl = document.getElementById('playerArtist');
    const coverEl = document.getElementById('playerCover');
    const poemEl = document.getElementById('playerPoem');
    const audioEl = document.getElementById('playerAudio');
    const audioSourceEl = document.getElementById('playerAudioSource');

    if (track) {
        titleEl.textContent = track.title;
        artistEl.textContent = track.artist;
        coverEl.src = track.cover;
        coverEl.alt = track.title;

        poemEl.innerHTML = '';
        track.poem.forEach(lineText => {
            const lineEl = document.createElement('span');
            lineEl.className = 'line';
            lineEl.textContent = lineText;
            poemEl.appendChild(lineEl);
        });

        audioSourceEl.src = track.audio;
        audioEl.load();
    } else {
        // آیدی نامعتبر یا موجود نیست
        titleEl.textContent = 'این قطعه پیدا نشد';
        artistEl.textContent = '';
        poemEl.textContent = 'به آلبوم برگرد و یکی از قطعات را انتخاب کن.';
    }
}

console.log('✅ اسکریپت سایت با موفقیت بارگذاری شد!');
