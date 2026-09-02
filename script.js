// ============================================================
// script.js
// ============================================================

// ============================================================
// 0. بارگذاری هدر و فوتر مشترک
// ============================================================

async function loadPartial(url, containerId) {
    const container = document.getElementById(containerId);

    if (!container) return;

    try {
        const res = await fetch(url, {
            cache: 'no-cache'
        });

        if (!res.ok) {
            throw new Error('پاسخ نامعتبر برای ' + url);
        }

        container.innerHTML = await res.text();

    } catch (error) {
        console.log(
            'خطا در بارگذاری بخش مشترک سایت:',
            url,
            error
        );
    }
}


// ============================================================
// تشخیص صفحه مجازی هفت خان
// ============================================================

function isHaftKhanVirtualRoute() {
    const path = window.location.pathname.replace(/\/+$/, '');

    return path === '/player/HaftKhan';
}


// ============================================================
// داده‌های هفت خان
//
// این داده‌ها از HaftKhan.html فعلی گرفته شده‌اند.
// ============================================================

const HAFT_KHAN_TRACKS = {

    1: {
        title: 'خان اول - هفت خان رستم',
        artist: 'شاهنامه فردوسی',
        cover: '/public/img/4956-450x450.jpg',
        audio: '/public/audio/HaftKhan/خان اول.mp3',
        poem: [
            'مصرع ۱',
            'مصرع ۲',
            'مصرع ۳',
            'مصرع ۴'
        ]
    },

    2: {
        title: 'خان دوم - هفت خان رستم',
        artist: 'شاهنامه فردوسی',
        cover: '/public/img/4956-450x450.jpg',
        audio: '/public/audio/HaftKhan/خان دوم.mp3',
        poem: [
            'مصرع ۱',
            'مصرع ۲',
            'مصرع ۳',
            'مصرع ۴'
        ]
    },

    3: {
        title: 'خان سوم - هفت خان رستم',
        artist: 'شاهنامه فردوسی',
        cover: '/public/img/4956-450x450.jpg',
        audio: '/public/audio/HaftKhan/خان سوم.mp3',
        poem: [
            'مصرع ۱',
            'مصرع ۲',
            'مصرع ۳',
            'مصرع ۴'
        ]
    },

    4: {
        title: 'خان چهارم - هفت خان رستم',
        artist: 'شاهنامه فردوسی',
        cover: '/public/img/4956-450x450.jpg',
        audio: '/public/audio/HaftKhan/خان چهارم.mp3',
        poem: [
            'مصرع ۱',
            'مصرع ۲',
            'مصرع ۳',
            'مصرع ۴'
        ]
    },

    5: {
        title: 'خان پنجم - هفت خان رستم',
        artist: 'شاهنامه فردوسی',
        cover: '/public/img/4956-450x450.jpg',
        audio: '/public/audio/HaftKhan/خان پنجم.mp3',
        poem: [
            'مصرع ۱',
            'مصرع ۲',
            'مصرع ۳',
            'مصرع ۴'
        ]
    },

    6: {
        title: 'خان ششم - هفت خان رستم',
        artist: 'شاهنامه فردوسی',
        cover: '/public/img/4956-450x450.jpg',
        audio: '/public/audio/HaftKhan/خان ششم .mp3',
        poem: [
            'مصرع ۱',
            'مصرع ۲',
            'مصرع ۳',
            'مصرع ۴'
        ]
    },

    7: {
        title: 'خان هفتم - هفت خان رستم',
        artist: 'شاهنامه فردوسی',
        cover: '/public/img/4956-450x450.jpg',
        audio: '/public/audio/HaftKhan/خان هفتم.mp3',
        poem: [
            'مصرع ۱',
            'مصرع ۲',
            'مصرع ۳',
            'مصرع ۴'
        ]
    }

};


// ============================================================
// ساخت صفحه هفت خان روی index.html
//
// این قسمت مشکل Cloudflare Pages را دور می‌زند.
// اگر Cloudflare برای /player/HaftKhan
// فایل index.html را برگرداند، این کد همان صفحه را
// به Player تبدیل می‌کند.
//
// بدون:
// - _redirects
// - Functions
// - تغییر نام HaftKhan.html
// ============================================================

function buildVirtualHaftKhanPage() {

    document.title = 'هفت خان رستم | Firoozeh Habibi';

    // --------------------------------------------------------
    // Head
    // --------------------------------------------------------

    const existingDescription =
        document.querySelector('meta[name="description"]');

    if (existingDescription) {

        existingDescription.setAttribute(
            'content',
            'پخش قطعات هفت خان رستم همراه با متن اشعار'
        );

    } else {

        const meta =
            document.createElement('meta');

        meta.name = 'description';

        meta.content =
            'پخش قطعات هفت خان رستم همراه با متن اشعار';

        document.head.appendChild(meta);
    }


    // --------------------------------------------------------
    // Body
    // --------------------------------------------------------

    document.body.innerHTML = `

        <div id="site-header"></div>

        <main>

            <section class="player-page">

                <div
                    class="player-container"
                    id="playerContainer"
                >

                    <img
                        id="playerCover"
                        src="/public/img/4956-450x450.jpg"
                        alt=""
                    />

                    <h2 id="playerTitle">
                        در حال بارگذاری...
                    </h2>

                    <p
                        class="artist"
                        id="playerArtist"
                    ></p>


                    <div class="poem-container">

                        <div
                            class="poem-text"
                            id="playerPoem"
                        ></div>

                    </div>


                    <div class="player-controls">

                        <audio
                            id="playerAudio"
                            controls
                            preload="metadata"
                        >

                            <source
                                id="playerAudioSource"
                                src=""
                                type="audio/mpeg"
                            >

                            مرورگر شما از پخش صدا پشتیبانی نمی‌کند.

                        </audio>

                    </div>


                    <a
                        href="/album.html?id=1"
                        class="back-btn"
                    >
                        <i class="bi bi-arrow-right"></i>
                        بازگشت به آلبوم
                    </a>

                </div>

            </section>

        </main>


        <div id="site-footer"></div>

    `;


    // --------------------------------------------------------
    // Player
    // --------------------------------------------------------

    initPlayerPage();


    // --------------------------------------------------------
    // Header / Footer
    // --------------------------------------------------------

    loadHeaderFooter();


    console.log(
        '✅ مسیر مجازی /player/HaftKhan ساخته شد.'
    );
}


// ============================================================
// مشخص کردن لینک فعال منو
// ============================================================

function setActiveNavLink() {

    const currentPath =
        location.pathname.replace(/\/+$/, '');

    const currentPage =
        currentPath.split('/').pop() || 'index.html';


    document
        .querySelectorAll('.nav__link[href]')
        .forEach(link => {

            const href =
                link.getAttribute('href');

            if (!href) return;


            if (
                href === currentPage ||
                href === currentPath
            ) {

                link.classList.add('active');


                const dropdownParent =
                    link.closest('.dropdown');


                if (dropdownParent) {

                    const toggle =
                        dropdownParent.querySelector(
                            '.dropdown__toggle'
                        );


                    if (toggle) {

                        toggle.classList.add(
                            'active'
                        );
                    }
                }
            }
        });
}


// ============================================================
// 1 و 2. منوی همبرگری
// ============================================================

function initHamburgerMenu() {

    const hamburger =
        document.getElementById(
            'hamburgerBtn'
        );


    const mainNav =
        document.getElementById(
            'mainNav'
        );


    if (
        hamburger &&
        mainNav
    ) {

        hamburger.addEventListener(
            'click',
            () => {

                hamburger.classList.toggle(
                    'active'
                );


                mainNav.classList.toggle(
                    'open'
                );

            }
        );
    }


    const navLinks =
        document.querySelectorAll(
            '.nav__link'
        );


    navLinks.forEach(link => {

        link.addEventListener(
            'click',
            () => {

                if (
                    link.classList.contains(
                        'dropdown__toggle'
                    )
                ) {
                    return;
                }


                if (
                    window.innerWidth <= 768 &&
                    hamburger &&
                    mainNav
                ) {

                    hamburger.classList.remove(
                        'active'
                    );


                    mainNav.classList.remove(
                        'open'
                    );
                }

            }
        );
    });
}


// ============================================================
// 3. ساب‌منو موبایل
// ============================================================

function initDropdownMenu() {

    const dropdownToggles =
        document.querySelectorAll(
            '.dropdown__toggle'
        );


    dropdownToggles.forEach(toggle => {

        toggle.addEventListener(
            'click',
            (e) => {

                if (
                    window.innerWidth <= 768
                ) {

                    e.preventDefault();


                    const parent =
                        toggle.closest(
                            '.dropdown'
                        );


                    if (parent) {

                        parent.classList.toggle(
                            'open'
                        );
                    }
                }

            }
        );
    });
}


// ============================================================
// 4. افکت اسکرول هدر
// ============================================================

function initHeaderScrollEffect() {

    const header =
        document.querySelector(
            '.header'
        );


    if (header) {

        window.addEventListener(
            'scroll',
            () => {

                if (
                    window.scrollY > 50
                ) {

                    header.classList.add(
                        'scrolled'
                    );

                } else {

                    header.classList.remove(
                        'scrolled'
                    );
                }

            }
        );
    }
}


// ============================================================
// 5. سال فوتر
// ============================================================

function initFooterYear() {

    const yearEl =
        document.getElementById(
            'year'
        );


    if (yearEl) {

        yearEl.textContent =
            new Date().getFullYear();
    }
}


// ============================================================
// Header / Footer
// ============================================================

async function loadHeaderFooter() {

    await Promise.all([

        loadPartial(
            '/public/header.html',
            'site-header'
        ),

        loadPartial(
            '/public/footer.html',
            'site-footer'
        )

    ]);


    setActiveNavLink();

    initHamburgerMenu();

    initDropdownMenu();

    initHeaderScrollEffect();

    initFooterYear();
}


// ============================================================
// 6. لایت‌باکس
// ============================================================

function initLightbox() {

    const lightbox =
        document.getElementById(
            'lightbox'
        );


    const lightboxImg =
        document.getElementById(
            'lightboxImg'
        );


    const lightboxCaption =
        document.getElementById(
            'lightboxCaption'
        );


    const lightboxClose =
        document.getElementById(
            'lightboxClose'
        );


    const portfolioCards =
        document.querySelectorAll(
            '.portfolio-card'
        );


    if (
        lightbox &&
        lightboxImg
    ) {

        portfolioCards.forEach(
            card => {

                card.addEventListener(
                    'click',
                    () => {

                        const img =
                            card.querySelector(
                                'img'
                            );


                        const title =
                            card.querySelector(
                                '.portfolio-card__title'
                            )?.textContent || '';


                        if (img) {

                            lightboxImg.src =
                                img.src;


                            lightboxImg.alt =
                                img.alt;
                        }


                        if (
                            lightboxCaption
                        ) {

                            lightboxCaption.textContent =
                                title;
                        }


                        lightbox.classList.add(
                            'open'
                        );

                    }
                );

            }
        );


        const closeLightbox =
            () => {

                lightbox.classList.remove(
                    'open'
                );

            };


        if (lightboxClose) {

            lightboxClose.addEventListener(
                'click',
                closeLightbox
            );
        }


        lightbox.addEventListener(
            'click',
            (e) => {

                if (
                    e.target ===
                    lightbox
                ) {

                    closeLightbox();
                }

            }
        );


        document.addEventListener(
            'keydown',
            (e) => {

                if (
                    e.key === 'Escape'
                ) {

                    closeLightbox();
                }

            }
        );

    } else {

        document
            .querySelectorAll(
                '.portfolio-card[data-href]'
            )
            .forEach(card => {

                card.addEventListener(
                    'click',
                    () => {

                        window.location.href =
                            card.dataset.href;

                    }
                );

            });
    }
}


// ============================================================
// 7. فرم تماس
// ============================================================

function initContactForm() {

    const contactForm =
        document.getElementById(
            'contactForm'
        );


    const formStatus =
        document.getElementById(
            'formStatus'
        );


    if (
        contactForm &&
        formStatus
    ) {

        contactForm.addEventListener(
            'submit',
            (e) => {

                e.preventDefault();


                formStatus.textContent =
                    'پیام شما با موفقیت ثبت شد. به‌زودی با شما تماس می‌گیریم.';


                formStatus.classList.add(
                    'success'
                );


                contactForm.reset();

            }
        );
    }
}


// ============================================================
// داده آلبوم‌ها
// ============================================================

const ALBUMS = {

    1: {

        title: 'هفت خان رستم',

        artist: 'شاهنامه فردوسی',

        cover:
            '/public/img/4956-450x450.jpg',

        description:
            'روایت صوتی هفت خان رستم در شاهنامه‌ی فردوسی.',

        playerPage:
            '/player/HaftKhan',

        tracks: [

            {
                id: 1,
                title: 'خان اول'
            },

            {
                id: 2,
                title: 'خان دوم'
            },

            {
                id: 3,
                title: 'خان سوم'
            },

            {
                id: 4,
                title: 'خان چهارم'
            },

            {
                id: 5,
                title: 'خان پنجم'
            },

            {
                id: 6,
                title: 'خان ششم'
            },

            {
                id: 7,
                title: 'خان هفتم'
            }

        ]
    },


    2: {

        title: 'رؤیاهای شهری',

        artist: 'خواننده: سارا احمدی',

        cover:
            '/public/img/4956-450x450.jpg',

        description:
            'روایتی صوتی از شب‌های شهر و رؤیاهایی که در آن جریان دارند.',

        playerPage:
            'player-2.html',

        tracks: [

            {
                id: 1,
                title: 'قطعه اول'
            },

            {
                id: 2,
                title: 'قطعه دوم'
            },

            {
                id: 3,
                title: 'قطعه سوم'
            }

        ]
    },


    3: {

        title: 'شب‌های بی‌خوابی',

        artist: 'خواننده: علی کریمی',

        cover:
            '/public/img/4956-450x450.jpg',

        description:
            'قطعاتی برای شب‌هایی که خواب به چشم نمی‌آید.',

        playerPage:
            'player-3.html',

        tracks: [

            {
                id: 1,
                title: 'قطعه اول'
            },

            {
                id: 2,
                title: 'قطعه دوم'
            },

            {
                id: 3,
                title: 'قطعه سوم'
            }

        ]
    },


    4: {

        title: 'طبیعت و صدا',

        artist: 'خواننده: نرگس محمدی',

        cover:
            '/public/img/4956-450x450.jpg',

        description:
            'ترکیبی از صداهای طبیعت و ملودی‌های آرام.',

        playerPage:
            'player-4.html',

        tracks: [

            {
                id: 1,
                title: 'قطعه اول'
            },

            {
                id: 2,
                title: 'قطعه دوم'
            },

            {
                id: 3,
                title: 'قطعه سوم'
            }

        ]
    },


    5: {

        title: 'ضربان قلب',

        artist: 'خواننده: حسین نوروزی',

        cover:
            '/public/img/4956-450x450.jpg',

        description:
            'قطعاتی پرانرژی با ریتمی که ضربان قلب را بالا می‌برد.',

        playerPage:
            'player-5.html',

        tracks: [

            {
                id: 1,
                title: 'قطعه اول'
            },

            {
                id: 2,
                title: 'قطعه دوم'
            },

            {
                id: 3,
                title: 'قطعه سوم'
            }

        ]
    },


    6: {

        title: 'سفر به یادها',

        artist: 'خواننده: زهرا موسوی',

        cover:
            '/public/img/4956-450x450.jpg',

        description:
            'سفری صوتی در دل خاطرات، همراه با کلامی نوستالژیک.',

        playerPage:
            'player-6.html',

        tracks: [

            {
                id: 1,
                title: 'قطعه اول'
            },

            {
                id: 2,
                title: 'قطعه دوم'
            },

            {
                id: 3,
                title: 'قطعه سوم'
            }

        ]
    }

};


// ============================================================
// 8. صفحه آلبوم
// ============================================================

function initAlbumPage() {

    const albumTitleEl =
        document.getElementById(
            'albumTitle'
        );


    if (!albumTitleEl) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const albumId =
        params.get('id');


    const album =
        ALBUMS[albumId];


    const coverEl =
        document.getElementById(
            'albumCover'
        );


    const artistEl =
        document.getElementById(
            'albumArtist'
        );


    const descEl =
        document.getElementById(
            'albumDescription'
        );


    const tracksEl =
        document.getElementById(
            'albumTracks'
        );


    if (!album) {

        albumTitleEl.textContent =
            'این آلبوم پیدا نشد';


        if (artistEl) {
            artistEl.textContent = '';
        }


        if (descEl) {

            descEl.textContent =
                'به لیست آلبوم‌ها برگرد و یکی را انتخاب کن.';
        }


        return;
    }


    if (coverEl) {

        coverEl.src =
            album.cover;


        coverEl.alt =
            album.title;
    }


    albumTitleEl.textContent =
        album.title;


    if (artistEl) {

        artistEl.textContent =
            album.artist;
    }


    if (descEl) {

        descEl.textContent =
            album.description;
    }


    if (tracksEl) {

        tracksEl.innerHTML = '';


        album.tracks.forEach(
            track => {

                const link =
                    document.createElement(
                        'a'
                    );


                link.className =
                    'track-card';


                link.href =
                    `${album.playerPage}?id=${track.id}`;


                link.innerHTML = `

                    <span class="track-card__icon">
                        <i class="bi bi-play-circle-fill"></i>
                    </span>

                    <span class="track-card__title">
                        ${track.title}
                    </span>

                `;


                tracksEl.appendChild(
                    link
                );

            }
        );
    }
}


// ============================================================
// 9. صفحه پخش
// ============================================================

function initPlayerPage() {

    const playerContainer =
        document.getElementById(
            'playerContainer'
        );


    if (!playerContainer) {
        return;
    }


    // --------------------------------------------------------
    // اگر صفحه مجازی هفت خان است
    // از داده داخلی script.js استفاده می‌کنیم.
    // --------------------------------------------------------

    let tracks =
        HAFT_KHAN_TRACKS;


    // --------------------------------------------------------
    // اگر TRACKS از HaftKhan.html وجود داشته باشد،
    // همان داده را ترجیح می‌دهیم.
    // --------------------------------------------------------

    if (
        typeof TRACKS !== 'undefined' &&
        TRACKS
    ) {

        tracks =
            TRACKS;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const trackId =
        params.get('id');


    const track =
        tracks[trackId];


    const titleEl =
        document.getElementById(
            'playerTitle'
        );


    const artistEl =
        document.getElementById(
            'playerArtist'
        );


    const coverEl =
        document.getElementById(
            'playerCover'
        );


    const poemEl =
        document.getElementById(
            'playerPoem'
        );


    const audioEl =
        document.getElementById(
            'playerAudio'
        );


    const audioSourceEl =
        document.getElementById(
            'playerAudioSource'
        );


    // ========================================================
    // قطعه پیدا شد
    // ========================================================

    if (track) {

        // ----------------------------------------------------
        // عنوان
        // ----------------------------------------------------

        if (titleEl) {

            titleEl.textContent =
                track.title;
        }


        // ----------------------------------------------------
        // هنرمند
        // ----------------------------------------------------

        if (artistEl) {

            artistEl.textContent =
                track.artist || '';
        }


        // ----------------------------------------------------
        // کاور
        // ----------------------------------------------------

        if (coverEl) {

            let coverPath =
                track.cover || '';


            if (
                coverPath.startsWith('../')
            ) {

                coverPath =
                    coverPath.replace(
                        /^\.\.\//,
                        '/'
                    );

            } else if (
                coverPath.startsWith('./')
            ) {

                coverPath =
                    coverPath.replace(
                        /^\.\//,
                        '/'
                    );
            }


            coverEl.src =
                coverPath;


            coverEl.alt =
                track.title;
        }


        // ----------------------------------------------------
        // شعر
        // ----------------------------------------------------

        if (poemEl) {

            poemEl.innerHTML = '';


            if (
                Array.isArray(track.poem)
            ) {

                track.poem.forEach(
                    lineText => {

                        const lineEl =
                            document.createElement(
                                'span'
                            );


                        lineEl.className =
                            'line';


                        lineEl.textContent =
                            lineText;


                        poemEl.appendChild(
                            lineEl
                        );

                    }
                );

            } else if (
                typeof track.poem === 'string'
            ) {

                poemEl.textContent =
                    track.poem;

            } else {

                poemEl.textContent =
                    '';
            }
        }


        // ----------------------------------------------------
        // فایل صوتی
        // ----------------------------------------------------

        if (
            audioSourceEl &&
            audioEl
        ) {

            let audioPath =
                track.audio || '';


            if (
                audioPath.startsWith('../')
            ) {

                audioPath =
                    audioPath.replace(
                        /^\.\.\//,
                        '/'
                    );

            } else if (
                audioPath.startsWith('./')
            ) {

                audioPath =
                    audioPath.replace(
                        /^\.\//,
                        '/'
                    );
            }


            audioSourceEl.src =
                audioPath;


            audioEl.load();
        }


        return;
    }


    // ========================================================
    // آیدی نامعتبر
    // ========================================================

    if (titleEl) {

        titleEl.textContent =
            'این قطعه پیدا نشد';
    }


    if (artistEl) {

        artistEl.textContent =
            '';
    }


    if (poemEl) {

        poemEl.textContent =
            'به آلبوم برگرد و یکی از قطعات را انتخاب کن.';
    }
}


// ============================================================
// DOM Ready
// ============================================================

document.addEventListener(
    'DOMContentLoaded',
    () => {

        // ====================================================
        // مهم‌ترین قسمت:
        //
        // اگر Cloudflare برای
        // /player/HaftKhan?id=1
        // index.html را تحویل داده باشد،
        // index.html را به صفحه Player تبدیل می‌کنیم.
        // ====================================================

        if (
            isHaftKhanVirtualRoute()
        ) {

            buildVirtualHaftKhanPage();

            return;
        }


        // ====================================================
        // Header / Footer
        // ====================================================

        loadHeaderFooter();


        // ====================================================
        // Music Cards
        // ====================================================

        const musicCards =
            document.querySelectorAll(
                '.music-card'
            );


        musicCards.forEach(card => {

            card.addEventListener(
                'click',
                function () {

                    const title =
                        this.querySelector(
                            '.music-card__title'
                        )?.textContent || '';


                    const artist =
                        this.querySelector(
                            '.music-card__artist'
                        )?.textContent || '';


                    try {

                        localStorage.setItem(
                            'lastPlayed',
                            JSON.stringify({

                                title:
                                    title,

                                artist:
                                    artist,

                                time:
                                    new Date()
                                        .toLocaleString()

                            })
                        );

                    } catch (error) {

                        console.log(
                            'خطا در ذخیره‌سازی:',
                            error
                        );
                    }

                }
            );

        });


        // ====================================================
        // Lightbox
        // ====================================================

        initLightbox();


        // ====================================================
        // Contact Form
        // ====================================================

        initContactForm();


        // ====================================================
        // Album Page
        // ====================================================

        initAlbumPage();


        // ====================================================
        // Player Page
        // ====================================================

        initPlayerPage();

    }
);


// ============================================================
// پایان
// ============================================================

console.log(
    '✅ اسکریپت سایت با موفقیت بارگذاری شد!'
);
