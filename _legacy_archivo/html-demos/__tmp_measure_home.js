export async function measureHomeLoad() {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const clickEmoji = (emoji) => {
    [...document.querySelectorAll('button')].find((b) => (b.innerText || '').includes(emoji))?.click();
  };

  // Start from perfil if on home already, to force remount nav
  if (/homepages/i.test(location.pathname)) {
    clickEmoji('👤');
    for (let i = 0; i < 40; i++) {
      if (/perfilpro/i.test(location.pathname)) break;
      await sleep(50);
    }
    await sleep(200);
  }

  const t0 = performance.now();
  clickEmoji('🏠');

  const marks = {};
  for (let i = 0; i < 80; i++) {
    await sleep(25);
    const t = document.body.innerText || '';
    const ms = Math.round(performance.now() - t0);
    if (!marks.path && /homepages/i.test(location.pathname)) marks.path = ms;
    if (!marks.stories && (/Tu historia/i.test(t) || /activa/i.test(t))) marks.stories = ms;
    if (!marks.posts && document.querySelectorAll('[id^="post-"]').length > 0) {
      marks.posts = ms;
      marks.postCount = document.querySelectorAll('[id^="post-"]').length;
    }
    if (!marks.suggestions && (/Sugerencias/i.test(t))) {
      // ready when either list or empty state after shell
      if (/Sin sugerencias/i.test(t) || /Ser fan|Hacerte fan|@/i.test(t) || document.querySelectorAll('[class*="suggest"]').length) {
        marks.suggestions = ms;
        marks.suggestionsEmpty = /Sin sugerencias/i.test(t);
      }
    }
    if (!marks.notif && document.querySelector('button[aria-label="Notificaciones"], button[title*="Notif"]')) {
      marks.notif = ms;
    }
    if (marks.path && marks.stories && marks.posts && marks.suggestions && marks.notif) break;
  }

  const pass = (ms) => ms != null && ms <= 1000;
  return {
    marks: Object.fromEntries(
      Object.entries(marks).map(([k, v]) => {
        if (typeof v !== 'number') return [k, v];
        return [k, { ms: v, pass: pass(v) }];
      }),
    ),
    postCount: marks.postCount || document.querySelectorAll('[id^="post-"]').length,
    allPass: ['stories', 'posts', 'suggestions', 'notif'].every((k) => pass(marks[k])),
    maxMs: Math.max(...['stories', 'posts', 'suggestions', 'notif'].map((k) => marks[k] || 0).filter(Boolean)),
    snippet: (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 500),
  };
}
