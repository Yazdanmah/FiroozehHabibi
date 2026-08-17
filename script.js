// ===== 1. هَمبَرگِر =====
const hamburger = document.getElementById('hamburgerBtn');
const mainNav = document.getElementById('mainNav');

if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mainNav.classList.toggle('open');
    });
}

// ===== 2. بستن منو =====
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // لینک «نمونه کارها» خودش زیرمنو رو باز/بسته می‌کنه (بخش ۳)،
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

// ===== 3. ساب‌منو در موبایل =====
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

// ===== 4. افکت اسکرول =====
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

// ===== 5. باکس‌های موسیقی =====
document.addEventListener('DOMContentLoaded', () => {
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

    // ===== 6. سال فوتر =====
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ===== 7. لایت‌باکس گالری نمونه‌کار =====
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
    }

    // ===== 8. فرم تماس (بدون بک‌اند، فقط نمایش پیام موفقیت) =====
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

    // ===== 9. صفحه پخش (player.html) =====
    const playerContainer = document.getElementById('playerContainer');

    if (playerContainer) {
        // ---------------------------------------------------------------
        // ---------------------------------------------------------------
        const albums = {
            1: {
                title: 'آلبوم آرامش',
                artist: 'خواننده: ضایی',
                cover: 'public/img/4956-450x450.jpg',
                audio: 'public/audio/1.mp3',
                poem: ['مصرع ۱', 'مصرع ۲', 'مصرع ۳', 'مصرع ۴']
            },
            2: {
                title: 'رؤیاهای شهری',
                artist: 'خواننده: سارا احمدی',
                cover: 'public/img/4956-450x450.jpg',
                audio: 'public/audio/2.mp3',
                poem: ['مصرع ۱', 'مصرع ۲', 'مصرع ۳', 'مصرع ۴']
            },
            3: {
                title: 'شب‌های بی‌خوابی',
                artist: 'خواننده: علی کریمی',
                cover: 'public/img/4956-450x450.jpg',
                audio: 'public/audio/3.mp3',
                poem: ['مصرع ۱', 'مصرع ۲', 'مصرع ۳', 'مصرع ۴']
            },
            4: {
                title: 'طبیعت و صدا',
                artist: 'خواننده: نرگس محمدی',
                cover: 'public/img/4956-450x450.jpg',
                audio: 'public/audio/4.mp3',
                poem: ['مصرع ۱', 'مصرع ۲', 'مصرع ۳', 'مصرع ۴']
            },
            5: {
                title: 'ضربان قلب',
                artist: 'خواننده: حسین نوروزی',
                cover: 'public/img/4956-450x450.jpg',
                audio: 'public/audio/5.mp3',
                poem: ['مصرع ۱', 'مصرع ۲', 'مصرع ۳', 'مصرع ۴']
            },
            6: {
                title: 'سفر به یادها',
                artist: 'خواننده: زهرا موسوی',
                cover: 'public/img/4956-450x450.jpg',
                audio: 'public/audio/6.mp3',
                poem: ['مصرع ۱', 'مصرع ۲', 'مصرع ۳', 'مصرع ۴']
            }
        };

        const params = new URLSearchParams(window.location.search);
        const albumId = params.get('id');
        const album = albums[albumId];

        const titleEl = document.getElementById('playerTitle');
        const artistEl = document.getElementById('playerArtist');
        const coverEl = document.getElementById('playerCover');
        const poemEl = document.getElementById('playerPoem');
        const audioEl = document.getElementById('playerAudio');
        const audioSourceEl = document.getElementById('playerAudioSource');

        if (album) {
            titleEl.textContent = album.title;
            artistEl.textContent = album.artist;
            coverEl.src = album.cover;
            coverEl.alt = album.title;

            poemEl.innerHTML = '';
            album.poem.forEach(lineText => {
                const lineEl = document.createElement('span');
                lineEl.className = 'line';
                lineEl.textContent = lineText;
                poemEl.appendChild(lineEl);
            });

            audioSourceEl.src = album.audio;
            audioEl.load();
        } else {
            // آیدی نامعتبر یا موجود نیست
            titleEl.textContent = 'این آلبوم پیدا نشد';
            artistEl.textContent = '';
            poemEl.textContent = 'به لیست آلبوم‌ها برگرد و یکی را انتخاب کن.';
        }
    }
});

console.log('✅ اسکریپت سایت با موفقیت بارگذاری شد!');
