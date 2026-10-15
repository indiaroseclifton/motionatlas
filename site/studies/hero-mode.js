/* Hero mode for the live studies: loaded with ?hero, a study drops its own controls and background so it sits
   inside the home page hero, and tells the parent page once its first frames are drawn so the hero can fade it in. */
(() => {
  const hero = /[?&]hero\b/.test(location.search);
  if (hero) {
    document.documentElement.classList.add('hero');
    const st = document.createElement('style');
    st.textContent = 'html.hero,html.hero body,html.hero #stage,html.hero #canvas-container,html.hero #hero-stage{background:transparent!important}' +
      'html.hero #controls,html.hero #hud{display:none!important}';
    document.head.append(st);
  }
  let sent = false;
  window.studyReady = () => { if (sent || parent === window) return; sent = true;
    requestAnimationFrame(() => requestAnimationFrame(() => { try { parent.postMessage('study:ready', '*'); } catch (e) {} })); };
  window.studyHero = hero;
})();
