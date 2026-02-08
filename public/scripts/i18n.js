// Minimal i18n runtime (Task-07)
// - Framework: static HTML + JS
// - Persistence: localStorage key `np_lab_locale`
// - URL strategy: storage-only (no route changes)

const STORAGE_KEY = 'np_lab_locale';

let dictionaries = null;
let currentLocale = null;

function getBrowserLocale() {
  const lang = (navigator.language || '').toLowerCase();
  return lang.startsWith('ko') ? 'ko' : 'en';
}

function getStoredLocale() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'ko' || v === 'en' ? v : null;
  } catch {
    return null;
  }
}

function storeLocale(locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}

function resolveInitialLocale() {
  return getStoredLocale() || getBrowserLocale() || 'ko';
}

async function loadDictionaries() {
  if (dictionaries) return dictionaries;
  const [ko, en] = await Promise.all([
    fetch('/locales/ko.json', { cache: 'no-cache' }).then((r) => r.json()),
    fetch('/locales/en.json', { cache: 'no-cache' }).then((r) => r.json())
  ]);
  dictionaries = { ko, en };
  return dictionaries;
}

function getByPath(obj, path) {
  return path
    .split('.')
    .reduce((acc, k) => (acc && acc[k] != null ? acc[k] : null), obj);
}

export function t(key) {
  if (!dictionaries || !currentLocale) return key;
  const dict = dictionaries[currentLocale];
  const v = getByPath(dict, key);
  if (typeof v === 'string') return v;
  // fallback to ko
  const fallback = getByPath(dictionaries.ko, key);
  return typeof fallback === 'string' ? fallback : key;
}

export function getLocale() {
  return currentLocale;
}

function applyTranslations() {
  // Text content
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    el.textContent = t(key);
  });

  // aria-label
  document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria-label');
    if (!key) return;
    el.setAttribute('aria-label', t(key));
  });
}

export async function setLocale(locale) {
  const l = locale === 'ko' || locale === 'en' ? locale : 'ko';
  await loadDictionaries();
  currentLocale = l;
  storeLocale(l);
  document.documentElement.lang = l;

  applyTranslations();

  // Update toggle UI state
  const btn = document.getElementById('langToggle');
  if (btn) {
    btn.setAttribute('data-locale', l);
    btn.textContent = l === 'ko' ? 'KO' : 'EN';
    // Two-state button: pressed=true means EN selected (arbitrary but consistent)
    btn.setAttribute('aria-pressed', l === 'en' ? 'true' : 'false');
  }
}

export async function initI18n() {
  await loadDictionaries();
  const initial = resolveInitialLocale();
  await setLocale(initial);
}
