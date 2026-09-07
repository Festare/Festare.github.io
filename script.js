// Элементы переключателя сияния
const toggleBtn = document.getElementById('toggleBtn');
const btnText = document.getElementById('btnText');
const heartIcon = document.getElementById('heartIcon');

// Элементы Cookie-баннера
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookie = document.getElementById('acceptCookie');
const declineCookie = document.getElementById('declineCookie');

let isGlowOn = true;

// Функция обновления внешнего вида страницы в зависимости от состояния сияния
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

// Загрузка сохраненного состояния сияния при старте (ТОЛЬКО если cookie приняты)
window.addEventListener('load', () => {
    const cookieConsent = localStorage.getItem('cookieAccepted');

    // Если cookie приняты, восстанавливаем сохраненное состояние сияния
    if (cookieConsent === 'true') {
        const savedGlow = localStorage.getItem('glowState');
        if (savedGlow !== null) {
            updateGlowUI(savedGlow === 'true');
        }
    }

    // Показываем плашку, если пользователь ещё не сделал выбор
    if (!cookieConsent) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 800);
    }
});

// Клик по кнопке переключения сияния
toggleBtn.addEventListener('click', () => {
    const newState = !isGlowOn;
    updateGlowUI(newState);

    // Сохраняем состояние ТОЛЬКО если пользователь дал согласие на cookie
    if (localStorage.getItem('cookieAccepted') === 'true') {
        localStorage.setItem('glowState', newState);
    }
});

// Нажатие кнопки «Принять»
acceptCookie.addEventListener('click', () => {
    localStorage.setItem('cookieAccepted', 'true');
    // Сразу сохраняем текущее состояние сияния
    localStorage.setItem('glowState', isGlowOn);
    cookieBanner.classList.remove('show');
});

// Нажатие кнопки «Отклонить»
declineCookie.addEventListener('click', () => {
    localStorage.setItem('cookieAccepted', 'false');
    // Удаляем ранее сохраненные настройки сияния, если они были
    localStorage.removeItem('glowState');
    cookieBanner.classList.remove('show');
});