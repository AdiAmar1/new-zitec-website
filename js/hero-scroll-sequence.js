(() => {
    // Resolve frames relative to this script so HE (/) and EN (/en/) both work.
    const scriptEl = document.currentScript;
    const FRAME_BASE = scriptEl?.dataset?.frameBase
        || new URL("../images1/hero-sequence/", scriptEl?.src || document.baseURI).href;
    const FRAME_COUNT = 240;
    const FRAME_PAD = 3;
    // Cache-bust so replaced frame files are not served from an old browser cache.
    const FRAME_CACHE = "20260723rev";
    const FRAME_SOURCES = Array.from({ length: FRAME_COUNT }, (_, index) => {
        const n = String(index + 1).padStart(FRAME_PAD, "0");
        return FRAME_BASE + "frame-" + n + ".jpg?" + FRAME_CACHE;
    });


    const section = document.getElementById("hero-sequence");
    const stage = section ? section.querySelector(".hero-seq-stage") : null;
    const canvas = document.getElementById("hero-sequence-canvas");
    const loading = document.getElementById("hero-sequence-loading");
    const progressBar = document.getElementById("hero-sequence-progress");
    const status = document.getElementById("hero-sequence-status");

    if (!section || !stage || !canvas || !loading || !progressBar || !status) return;

    // Phones show a static CSS background instead (see the hero media query),
    // so skip frame preloading and scroll pinning entirely.
    if (matchMedia("(max-width: 767px)").matches) {
        loading.setAttribute("aria-hidden", "true");
        return;
    }

    const context = canvas.getContext("2d", { alpha: false });
    const progressTrack = progressBar.parentElement;
    const images = new Array(FRAME_SOURCES.length);
    // Play end → start: begin on the last frame and scrub toward frame 0.
    const playhead = { frame: FRAME_COUNT - 1 };
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let loadedCount = 0;
    let lastRenderedFrame = -1;

    function updateLoading() {
        const percent = Math.round((loadedCount / FRAME_SOURCES.length) * 100);
        progressBar.style.width = percent + "%";
        progressTrack.setAttribute("aria-valuenow", String(percent));
        status.textContent = percent + "%";
    }

    function resizeCanvas() {
        const rect = stage.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const displayWidth = Math.max(1, Math.round(rect.width || innerWidth));
        const displayHeight = Math.max(1, Math.round(rect.height || innerHeight));
        const targetWidth = Math.round(displayWidth * dpr);
        const targetHeight = Math.round(displayHeight * dpr);

        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
            canvas.width = targetWidth;
            canvas.height = targetHeight;
        }

        renderFrame(Math.round(playhead.frame), true);
    }

    function renderFrame(index, force) {
        const safeIndex = Math.max(0, Math.min(images.length - 1, index));
        const image = images[safeIndex];
        if (!image || !image.complete || !image.naturalWidth) return;
        if (!force && safeIndex === lastRenderedFrame) return;

        const canvasRatio = canvas.width / canvas.height;
        const imageRatio = image.naturalWidth / image.naturalHeight;
        let drawWidth;
        let drawHeight;

        // Cover the hero while keeping the frame centered on any screen size.
        if (imageRatio > canvasRatio) {
            drawHeight = canvas.height;
            drawWidth = drawHeight * imageRatio;
        } else {
            drawWidth = canvas.width;
            drawHeight = drawWidth / imageRatio;
        }

        const x = (canvas.width - drawWidth) / 2;
        const y = (canvas.height - drawHeight) / 2;
        context.fillStyle = "#050505";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(image, x, y, drawWidth, drawHeight);
        lastRenderedFrame = safeIndex;
    }

    function nearestLoadedFrame(index) {
        if (images[index]) return index;

        for (let offset = 1; offset < images.length; offset += 1) {
            if (images[index - offset]) return index - offset;
            if (images[index + offset]) return index + offset;
        }

        return 0;
    }

    function setFrame(index) {
        renderFrame(nearestLoadedFrame(Math.round(index)));
    }

    function preloadFrames() {
        // Load in small batches so remote visitors get progress feedback
        // and weak connections are not flooded with hundreds of requests.
        // Start from the end so the first visible (reversed) frame paints early.
        const concurrency = 6;
        let nextIndex = FRAME_SOURCES.length - 1;

        return new Promise((resolve) => {
            let active = 0;

            const kick = () => {
                while (active < concurrency && nextIndex >= 0) {
                    const index = nextIndex;
                    nextIndex -= 1;
                    active += 1;

                    const image = new Image();
                    const settle = (loaded) => {
                        images[index] = loaded ? image : null;
                        loadedCount += 1;
                        updateLoading();

                        if (index === FRAME_COUNT - 1 && loaded) {
                            resizeCanvas();
                            renderFrame(FRAME_COUNT - 1, true);
                        }

                        active -= 1;
                        if (loadedCount >= FRAME_SOURCES.length) {
                            resolve();
                        } else {
                            kick();
                        }
                    };

                    image.onload = () => settle(true);
                    image.onerror = () => settle(false);
                    image.src = FRAME_SOURCES[index];
                }
            };

            kick();
        });
    }


    let headerRevealTimer = null;

    function setHeaderDuringSequence(active) {
        clearTimeout(headerRevealTimer);
        const header = document.getElementById("header");

        if (active) {
            // Hide immediately when the sequence starts or is in progress.
            document.body.classList.add("hero-seq-playing");
            if (header && window.gsap) {
                window.gsap.killTweensOf(header);
            }
            return;
        }

        // Wait a beat after the sequence ends, then ease the menu back in.
        headerRevealTimer = setTimeout(() => {
            document.body.classList.remove("hero-seq-playing");

            if (header && window.gsap) {
                window.gsap.fromTo(
                    header,
                    { autoAlpha: 0, y: -28 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.65,
                        ease: "power2.out",
                        clearProps: "opacity,visibility,transform"
                    }
                );
            }

            headerRevealTimer = null;
        }, 10);
    }

    function initNativeFallback() {
        section.style.height = "400vh";
        stage.style.position = "sticky";
        stage.style.top = "0";
        stage.style.height = "100vh";

        const onScroll = () => {
            const rect = section.getBoundingClientRect();
            const distance = Math.max(1, section.offsetHeight - innerHeight);
            const scrollProgress = Math.max(0, Math.min(1, -rect.top / distance));
            playhead.frame = (1 - scrollProgress) * (images.length - 1);
            setFrame(playhead.frame);
            // Hide the sticky menu while the sequence is still playing.
            setHeaderDuringSequence(scrollProgress > 0 && scrollProgress < 1);
        };

        addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    function initSequence() {
        loading.setAttribute("aria-hidden", "true");
        section.classList.add("is-ready");
        resizeCanvas();

        if (reducedMotion) {
            setFrame(images.length - 1);
            return;
        }

        const gsapReady = window.gsap && typeof window.gsap.registerPlugin === "function";

        if (gsapReady && window.ScrollTrigger) {
            window.gsap.registerPlugin(window.ScrollTrigger);
            window.gsap.to(playhead, {
                frame: 0,
                ease: "none",
                snap: { frame: 1 },
                onUpdate: () => setFrame(playhead.frame),
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: () => "+=" + Math.max(innerHeight * 1.35, 110),
                    pin: true,
                    scrub: 0.45,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onToggle: (self) => setHeaderDuringSequence(self.isActive)
                }
            });

            window.ScrollTrigger.addEventListener("refreshInit", resizeCanvas);
            window.ScrollTrigger.refresh();
        } else {
            initNativeFallback();
        }
    }

    let resizeTimer;
    addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeCanvas, 100);
    }, { passive: true });

    resizeCanvas();
    preloadFrames()
        .then(() => {
            const anyLoaded = images.some(Boolean);
            if (!anyLoaded) {
                status.textContent = "Animation unavailable";
                loading.setAttribute("aria-hidden", "true");
                section.classList.add("is-ready");
                return;
            }
            initSequence();
        })
        .catch(() => {
            status.textContent = "Animation unavailable";
            loading.setAttribute("aria-hidden", "true");
            section.classList.add("is-ready");
            renderFrame(FRAME_COUNT - 1, true);
        });
})();
