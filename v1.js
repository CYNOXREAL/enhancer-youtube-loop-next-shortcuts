// YouTube Auto Loop + Shortcuts (Enhancer version)
// Author: CYNOXREAL
// GitHub: https://github.com/CYNOXREAL
(function () {
    'use strict';

    let lastVideoId = null;
    let userDisabledLoop = false;

    function getVideoId() {
        const url = new URL(location.href);
        return url.searchParams.get("v");
    }

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

        requestAnimationFrame(() => toast.style.opacity = '1');
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 1200);
    }

    function clickLoopButton(showStatus = true) {
        const loopBtn = document.querySelector('#efyt-loop');
        if (!loopBtn) return;

        const btn = loopBtn.closest('button, svg');
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        setTimeout(() => {
            const video = document.querySelector('video');
            if (!video) return;

            // we remember the user's decision
            if (!video.loop) userDisabledLoop = true;
            if (video.loop) userDisabledLoop = false;

            if (showStatus) showToast(video.loop ? 'Loop ON' : 'Loop OFF');
        }, 100);
    }

    function enableLoopForNewVideo() {
        const video = document.querySelector('video');
        if (!video) return;

        let tries = 0;
        const waitLoop = setInterval(() => {
            const loopBtn = document.querySelector('#efyt-loop');

            if (loopBtn) {
                // auto-loop only if the user has not disabled it
                if (!userDisabledLoop && !video.loop) {
                    clickLoopButton(false);
                    showToast("Loop ON");
                }
                clearInterval(waitLoop);
            }

            tries++;
            if (tries > 25) clearInterval(waitLoop);
        }, 200);
    }

    // keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (!e.target.matches('input, textarea')) {
            if (e.key.toLowerCase() === 'r') clickLoopButton(true);

            if (e.key.toLowerCase() === 'n') {
                const nextBtn = document.querySelector('.ytp-next-button');
                if (nextBtn) {
                    nextBtn.click();
                    showToast("Next Video");
                }
            }
        }
    });

    // detecting a new movie by ID
    setInterval(() => {
        const id = getVideoId();
        if (!id) return;

        if (id !== lastVideoId) {
            lastVideoId = id;
            enableLoopForNewVideo();
        }
    }, 300);
})();
