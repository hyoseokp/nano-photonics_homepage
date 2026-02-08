// Mobile drawer menu (Task: mobile nav fix)
// Non-destructive: keeps existing desktop nav + existing event handlers.

(function () {
  const btn = document.getElementById('menuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  if (!btn || !drawer || !overlay) return;

  const open = () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    // focus first link
    const first = drawer.querySelector('a,button');
    if (first) first.focus();
  };

  const close = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.focus();
  };

  btn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    isOpen ? close() : open();
  });

  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) close();
  });

  // Close after clicking a nav item
  drawer.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-page]');
    if (a) close();
  });

  // On mobile, hide desktop header actions row (inline styles can fight CSS)
  const applyMobileHeaderHides = () => {
    try {
      const isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
      const rowEnd = document.querySelector('header .row-end');
      if (rowEnd) {
        if (isMobile) {
          rowEnd.style.setProperty('display', 'none', 'important');
          rowEnd.setAttribute('data-mobile-hidden', '1');
        } else {
          rowEnd.style.removeProperty('display');
          rowEnd.removeAttribute('data-mobile-hidden');
        }
      }
    } catch {}
  };

  // Mobile header title: swap full/short to avoid wrapping and horizontal overflow
  const applyMobileTitle = () => {
    try {
      const isMobile = window.matchMedia && window.matchMedia('(max-width: 430px)').matches;
      const titleEl = document.querySelector('header .logo .site-title');
      if (!titleEl) return;
      const full = titleEl.getAttribute('data-full') || titleEl.textContent;
      const short = titleEl.getAttribute('data-short') || full;
      titleEl.textContent = isMobile ? short : full;
    } catch {}
  };

  applyMobileHeaderHides();
  applyMobileTitle();
  window.addEventListener('resize', () => {
    applyMobileHeaderHides();
    applyMobileTitle();
  });

  // Wire mobile action buttons to existing ones
  const mapClick = (fromId, toId) => {
    const from = document.getElementById(fromId);
    const to = document.getElementById(toId);
    if (!from || !to) return;
    from.addEventListener('click', async () => {
      to.click();
    });
  };

  mapClick('mobileLangToggle', 'langToggle');
  mapClick('mobileAdminBtn', 'signInBtn');
  mapClick('mobileSignOutBtn', 'signOutBtn');

  // Mirror auth UI state into mobile drawer
  const syncAuthState = () => {
    const userEmail = document.getElementById('userEmail');
    const signInBtn = document.getElementById('signInBtn');
    const signOutBtn = document.getElementById('signOutBtn');

    const mobileEmail = document.getElementById('mobileUserEmail');
    const mobileAdminBtn = document.getElementById('mobileAdminBtn');
    const mobileSignOutBtn = document.getElementById('mobileSignOutBtn');

    if (!mobileEmail || !mobileAdminBtn || !mobileSignOutBtn) return;

    const signedIn = userEmail && !userEmail.classList.contains('hidden') && userEmail.textContent.trim().length > 0;

    mobileEmail.textContent = userEmail ? userEmail.textContent : '';
    mobileEmail.classList.toggle('hidden', !signedIn);

    mobileAdminBtn.classList.toggle('hidden', signedIn);
    mobileSignOutBtn.classList.toggle('hidden', !signedIn);

    // Keep labels consistent
    if (signInBtn) mobileAdminBtn.textContent = signInBtn.textContent;
    if (signOutBtn) mobileSignOutBtn.textContent = signOutBtn.textContent;
  };

  // best-effort periodic sync (cheap)
  syncAuthState();
  setInterval(syncAuthState, 1000);
})();
