/* Shared by the live studies.
   ?hero            drops the study's own controls and background so it sits inside the home page hero, and tells
                    the parent page once its first frames are drawn so the hero can fade it in.
   Embed settings (any study): ?speed=0.25–3  ?density=0.2–1.5 (particle count)  ?mode=<name>  ?controls=0  ?bg=transparent */
(() => {
  const q = new URLSearchParams(location.search);
  const num = (k, d, lo, hi) => { const v = parseFloat(q.get(k)); return isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d; };
  const hero = q.has('hero');
  const params = { speed: num('speed', 1, .25, 3), density: num('density', 1, .2, 1.5), mode: (q.get('mode') || '').toLowerCase(),
    controls: !hero && q.get('controls') !== '0', transparent: hero || q.get('bg') === 'transparent' };
  const css = [];
  if (params.transparent) css.push('html,body,#stage,#canvas-container,#hero-stage{background:transparent!important}');
  if (!params.controls) css.push('#controls,#hud{display:none!important}');
  if (css.length) { const st = document.createElement('style'); st.textContent = css.join(''); document.head.append(st); }
  if (hero) document.documentElement.classList.add('hero');
  // start in a named mode by pressing the matching scene button once the study has wired its controls
  if (params.mode) document.addEventListener('DOMContentLoaded', () => { const b = document.querySelector(`.mode[data-key="${params.mode}"]`); if (b) b.click(); });
  let sent = false;
  window.studyReady = () => { if (sent || parent === window) return; sent = true;
    requestAnimationFrame(() => requestAnimationFrame(() => { try { parent.postMessage('study:ready', '*'); } catch (e) {} })); };
  window.studyHero = hero;
  window.studyParams = params;
})();
