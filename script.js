document.addEventListener('DOMContentLoaded', () => {
  const btnHome = document.getElementById('btnHome');
  const btnEmpty = document.getElementById('btnEmpty');
  const mainView = document.getElementById('mainView');

  const navButtons = [btnHome, btnEmpty].filter(Boolean);

  function setActiveButton(clickedBtn) {
    navButtons.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
  }

  if (btnHome && mainView) {
    btnHome.addEventListener('click', () => {
      setActiveButton(btnHome);
      mainView.classList.remove('hidden');
    });
  }

  if (btnEmpty && mainView) {
    btnEmpty.addEventListener('click', () => {
      setActiveButton(btnEmpty);
      mainView.classList.add('hidden');
    });
  }

  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    root.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      if (newTheme === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }

      localStorage.setItem('theme', newTheme);
    });
  }

  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAcceptBtn = document.getElementById('cookieAccept');
  const cookieDeclineBtn = document.getElementById('cookieDecline');

  const cookieConsent = localStorage.getItem('cookieConsent');

  if (!cookieConsent && cookieBanner) {
    setTimeout(() => {
      cookieBanner.classList.add('visible');
    }, 500);
  }

  if (cookieAcceptBtn && cookieBanner) {
    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('visible');
    });
  }

  if (cookieDeclineBtn && cookieBanner) {
    cookieDeclineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('visible');
    });
  }
});