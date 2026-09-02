// ============================================================
// script.js
// ============================================================

// ===== 0. بارگذاری هدر و فوتر مشترک از فایل‌های جدا =====
async function loadPartial(url, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const res = await fetch(url);

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
// پشتیبانی از URL بدون پسوند در Cloudflare Pages
// /player/HaftKhan?id=1
// ============================================================

function isHaftKhanVirtualRoute() {
    const path = window.location.pathname.replace(/\/+$/, '');

    return path === '/player/HaftKhan';
}


async function loadVirtualHaftKhanPage() {

    try {

        /*
         * فایل واقعی صفحه را می‌گیریم.
         *
         * URL مرورگر همچنان:
         *
         * /player/HaftKhan?id=1
         *
         * باقی می‌ماند.
         */
        const response = await fetch(
            '/player/HaftKhan.html',
            {
                cache: 'no-cache'
            }
        );

        if (!response.ok) {
            throw new Error(
                'فایل HaftKhan.html پیدا نشد: ' +
                response.status
            );
        }


        const html = await response.text();


        // تبدیل HTML دریافت‌شده به DOM
        const parser = new DOMParser();

        const page = parser.parseFromString(
            html,
            'text/html'
        );


        // --------------------------------------------------------
        // عنوان صفحه
        // --------------------------------------------------------

        if (page.title) {
            document.title = page.title;
        }


        // --------------------------------------------------------
        // Meta Description
        // --------------------------------------------------------

        const description =
            page.querySelector(
                'meta[name="description"]'
            );

        const currentDescription =
            document.querySelector(
                'meta[name="description"]'
            );


        if (description) {

            const content =
                description.getAttribute('content') || '';


            if (currentDescription) {

                currentDescription.setAttribute(
                    'content',
                    content
                );

            } else {

                const meta =
                    document.createElement('meta');

                meta.name = 'description';
                meta.content = content;

                document.head.appendChild(meta);
            }
        }


        // --------------------------------------------------------
        // محتوای body صفحه هفت خان
        // --------------------------------------------------------

        document.body.innerHTML =
            page.body.innerHTML;


        // --------------------------------------------------------
        // Bootstrap Icons
        // --------------------------------------------------------

        if (
            !document.querySelector(
                'link[href*="bootstrap-icons"]'
            )
        ) {

            const iconLink =
                document.createElement('link');

            iconLink.rel = 'stylesheet';

            iconLink.href =
                'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';

            document.head.appendChild(
                iconLink
            );
        }


        // --------------------------------------------------------
        // اجرای script داخلی HaftKhan.html
        // --------------------------------------------------------
        //
        // این قسمت مهم است چون TRACKS داخل خود
        // HaftKhan.html تعریف شده است.
        //

        page.body
            .querySelectorAll('script')
            .forEach(oldScript => {

                // script خارجی script.js را دوباره اجرا نکن
                if (oldScript.src) {
                    return;
                }


                const newScript =
                    document.createElement('script');

                newScript.textContent =
                    oldScript.textContent;


                document.body.appendChild(
                    newScript
                );
            });


        // --------------------------------------------------------
        // اصلاح مسیر کاور
        // --------------------------------------------------------

        const cover =
            document.getElementById(
                'playerCover'
            );


        if (
            cover &&
            cover.getAttribute('src')
        ) {

            const src =
                cover.getAttribute('src');


            /*
             * تبدیل مسیرهای نسبی مثل:
             *
             * ../public/img/...
             *
             * به مسیر صحیح سایت
             */
            if (
                src.startsWith('../') ||
                src.startsWith('./')
            ) {

                cover.src =
                    new URL(
                        src,
                        window.location.origin +
                        '/player/'
                    ).href;
            }
        }


        // --------------------------------------------------------
        // Header / Footer
        // --------------------------------------------------------

        await loadHeaderFooter();


        // --------------------------------------------------------
        // اجرای Player
        // --------------------------------------------------------

        initPlayerPage();


        console.log(
            '✅ صفحه /player/HaftKhan با موفقیت بارگذاری شد.'
        );


    } catch (error) {

        console.error(
            '❌ خطا در بارگذاری صفحه /player/HaftKhan:',
            error
        );
    }
}



// ============================================================
// مشخص کردن لینک فعال منو بر اساس صفحه جاری
// ============================================================

function setActiveNavLink() {

    const currentPage =
        location.pathname
            .split('/')
            .pop() || 'index.html';


    document
        .querySelectorAll(
            '.nav__link[href]'
        )
        .forEach(link => {

            if (
                link.getAttribute('href') ===
                currentPage
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
// 1 و 2. همبرگر و بستن منو در موبایل
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

                /*
                 * لینک «نمونه کارها»
                 * خودش زیرمنو را باز و بسته می‌کند.
                 */
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
// 3. ساب‌منو در موبایل
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
// 4. افکت اسکرول
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
// سال فوتر
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
// اجرای موارد وابسته به Header / Footer
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
// DOM Ready
// ============================================================

document.addEventListener(
    'DOMContentLoaded',
    () => {


        /*
         * اگر کاربر دقیقاً وارد:
         *
         * /player/HaftKhan?id=1
         *
         * شده باشد، Cloudflare ممکن است index.html
         * را تحویل دهد.
         *
         * در این حالت صفحه واقعی HaftKhan.html
         * را داخل همین URL بارگذاری می‌کنیم.
         */
        if (
            isHaftKhanVirtualRoute()
        ) {

            loadVirtualHaftKhanPage();

            return;
        }


        // Header / Footer
        loadHeaderFooter();


        // =====================================================
        // 5. باکس‌های موسیقی
        // =====================================================

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
                                title: title,
                                artist: artist,
                                time: new Date()
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



        // =====================================================
        // 6. لایت‌باکس گالری نمونه‌کار
        // =====================================================

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
                () =>
                    lightbox.classList.remove(
                        'open'
                    );


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

            /*
             * در صفحه اصلی لایت‌باکس وجود ندارد.
             * کارت‌های نمونه‌کار به صفحه مربوطه هدایت می‌شوند.
             */

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



        // =====================================================
        // 7. فرم تماس
        // =====================================================

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



        // =====================================================
        // 8. صفحه آلبوم
        // =====================================================

        initAlbumPage();



        // =====================================================
        // 9. صفحه پخش
        // =====================================================

        initPlayerPage();

    }
);



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

        /*
         * مهم:
         * لینک بدون پسوند
         */
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
// ساخت صفحه آلبوم
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
// صفحه پخش قطعه
// ============================================================

function initPlayerPage() {

    const playerContainer =
        document.getElementById(
            'playerContainer'
        );


    if (!playerContainer) {
        return;
    }


    /*
     * TRACKS داخل HaftKhan.html تعریف می‌شود.
     */
    if (
        typeof TRACKS ===
        'undefined'
    ) {

        console.log(
            'TRACKS هنوز تعریف نشده است.'
        );

        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const trackId =
        params.get('id');


    const track =
        TRACKS[trackId];


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


    if (track) {

        // ------------------------------------------------------
        // عنوان
        // ------------------------------------------------------

        if (titleEl) {

            titleEl.textContent =
                track.title;
        }


        // ------------------------------------------------------
        // هنرمند
        // ------------------------------------------------------

        if (artistEl) {

            artistEl.textContent =
                track.artist;
        }


        // ------------------------------------------------------
        // کاور
        // ------------------------------------------------------

        if (coverEl) {

            let coverPath =
                track.cover;


            /*
             * اگر مسیر نسبی بود، آن را به ریشه سایت
             * تبدیل می‌کنیم.
             */

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


        // ------------------------------------------------------
        // شعر
        // ------------------------------------------------------

        if (poemEl) {

            poemEl.innerHTML = '';


            if (
                Array.isArray(
                    track.poem
                )
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

            } else {

                poemEl.textContent = '';
            }
        }


        // ------------------------------------------------------
        // فایل صوتی
        // ------------------------------------------------------

        if (
            audioSourceEl &&
            audioEl
        ) {

            let audioPath =
                track.audio;


            /*
             * مسیرهای ../public/... را به
             * /public/... تبدیل می‌کنیم.
             */

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


    } else {

        // ------------------------------------------------------
        // آیدی نامعتبر
        // ------------------------------------------------------

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
}



// ============================================================
// پایان
// ============================================================

console.log(
    '✅ اسکریپت سایت با موفقیت بارگذاری شد!'
);
