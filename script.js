const toggleBtn = document.getElementById('toggleBtn');
const btnText = document.getElementById('btnText');
const heartIcon = document.getElementById('heartIcon');
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookie = document.getElementById('acceptCookie');
const declineCookie = document.getElementById('declineCookie');

let isGlowOn = true;

function updateGlowUI(glowState) {
    isGlowOn = glowState;
    if (isGlowOn) {
        document.body.classList.remove('glow-off');
        btnText.textContent = 'Сияние включено';
        heartIcon.textContent = '💜';
    } else {
        document.body.classList.add('glow-off');
        btnText.textContent = 'Сияние выключено';
        heartIcon.textContent = '🖤';
    }
}

window.addEventListener('load', () => {
    const cookieConsent = localStorage.getItem('cookieAccepted');

    if (cookieConsent === 'true') {
        const savedGlow = localStorage.getItem('glowState');
        if (savedGlow !== null) {
            updateGlowUI(savedGlow === 'true');
        }
    }

    if (!cookieConsent) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 800);
    }
});

toggleBtn.addEventListener('click', () => {
    const newState = !isGlowOn;
    updateGlowUI(newState);

    if (localStorage.getItem('cookieAccepted') === 'true') {
        localStorage.setItem('glowState', newState);
    }
});

acceptCookie.addEventListener('click', () => {
    localStorage.setItem('cookieAccepted', 'true');
    localStorage.setItem('glowState', isGlowOn);
    cookieBanner.classList.remove('show');
});

declineCookie.addEventListener('click', () => {
    localStorage.setItem('cookieAccepted', 'false');
    localStorage.removeItem('glowState');
    cookieBanner.classList.remove('show');
});
