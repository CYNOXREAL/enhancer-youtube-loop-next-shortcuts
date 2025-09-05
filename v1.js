(function() {
    'use strict';

    let lastVideo = null;

    // Function showing a toast with fade-in/fade-out
    function showToast(text) {
        let toast = document.createElement('div');
        toast.textContent = text;
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.75);
            color: #fff;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 18px;
            z-index: 9999;
            pointer-events: none;
            font-family: sans-serif;
            text-align: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(toast);

        // Fade-in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });

        // Fade-out after 1.2s
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 1200);
    }

    // Click on the Enhancer loop button
    function clickLoopButton(showStatus = true) {
        const loopBtn = document.querySelector('#efyt-loop');
        if (loopBtn) {
            const btn = loopBtn.closest('button, svg');
            btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            if (showStatus) {
                setTimeout(() => {
                    const video = document.querySelector('video');
                    if (video) {
                        showToast(video.loop ? 'Loop ON' : 'Loop OFF');
                    }
                }, 100);
            }
        }
    }

    // Enable loop at the start of the video (only once)
    function enableLoopOnce(video) {
        if (video && video !== lastVideo) {
            lastVideo = video;
            const checkBtn = setInterval(() => {
                const loopBtn = document.querySelector('#efyt-loop');
                if (loopBtn) {
                    if (!video.loop) {
                        clickLoopButton(false);
                        showToast('Loop ON');
                    }
                    clearInterval(checkBtn);
                }
            }, 300);
        }
    }

    // Click on the "Next" button
    function clickNextVideo() {
        const nextBtn = document.querySelector('.ytp-next-button');
        if (nextBtn) {
            nextBtn.click();
            showToast('Next Video');
        } else {
            console.warn('[Enhancer Script] Next button not found');
        }
    }

    // Keyboard shortcuts handling
    document.addEventListener('keydown', (e) => {
        if (!e.target.matches('input, textarea')) {
            if (e.key.toLowerCase() === 'r') {
                clickLoopButton(true);
            }
            if (e.key.toLowerCase() === 'n') {
                clickNextVideo();
            }
        }
    });

    // Observing DOM changes to detect a new video
    const observer = new MutationObserver(() => {
        const video = document.querySelector('video');
        if (video) {
            enableLoopOnce(video);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
