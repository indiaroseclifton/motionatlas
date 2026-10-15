/* Particle engine: turns a picture into an animated cloud of glowing grains.
   Used by the Particle studio and copied verbatim into every exported file, so it depends only on three.js r128.

   ParticleEngine.create(container, options) -> { set(options), destroy(), ready }
   options: imageA, imageB (URL or data URI), motion ('breathe'|'glide'|'flap'|'dissolve'|'morph'),
            count, grain, brightness, glow (0..1), threshold, palette ('original'|'gold'|'ice'|'champagne'|'rose'|'violet'|'custom'),
            tint ('#rrggbb'), background ('#rrggbb' or 'transparent'), bokeh (0..150), speed (0.25..3)

   Grains land where the picture is bright and finely detailed. Under them, a dim, feathered copy of the picture
   (the glow layer) carries detail grains alone can only hint at; it moves with the same maths as the grains. */
(function (root) {
  'use strict';
  const W = 900, SPAN = 8;
  const PALETTES = {
    gold: ['#9e4c0d', '#ff9a1f', '#ffd166', '#fff6dc'], ice: ['#0a1f73', '#1e6bff', '#5fb0ff', '#e6f4ff'],
    champagne: ['#6b4f2c', '#d4ad74', '#f6e2bd', '#fffaf0'], rose: ['#6d1736', '#e0457b', '#ff9ec0', '#fff0f5'],
    violet: ['#2c1673', '#7a5cff', '#c3b2ff', '#f4efff']
  };
  const hex = h => { const n = parseInt(String(h).replace('#', ''), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; };
  const mixc = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  function stopsFor(o) {
    if (o.palette === 'custom') { const t = hex(o.tint || '#ffb347'); return [t.map(v => v * .35), t.map(v => v * .8), mixc(t, [1, 1, 1], .35), mixc(t, [1, 1, 1], .82)]; }
    return (PALETTES[o.palette] || PALETTES.gold).map(hex);
  }
  const DEFAULTS = { motion: 'breathe', count: 120000, grain: 1, brightness: 1, glow: .5, threshold: .07, palette: 'original', tint: '#ffb347',
    background: '#030305', bokeh: 50, speed: 1 };
  const MOTIONS = { breathe: 0, glide: 1, flap: 2, dissolve: 3, morph: 4 };

  // shared motion maths: the grains and the glow layer both run these, so they never drift apart
  const MOVE = `
    uniform float uTime, uMotion, uK, uHalf; uniform vec3 uOff;
    vec3 shapeMove(vec3 p){
      if (uMotion == 1.0) {                       // glide: a wave runs from the right-hand (leading) edge to the trailing edge
        float s = clamp((uHalf - p.x) / (2.0 * uHalf), 0.0, 1.0);
        p.y += .055 * uHalf * pow(s, 2.2) * sin(1.37 * uTime - s * 2.4) + .012 * uHalf * sin(1.37 * uTime + 1.3);
        p.z += .02 * uHalf * s * s * cos(1.37 * uTime - s * 2.4);
      } else if (uMotion == 2.0) {                // flap: everything either side of the centre line turns about it
        float th = .1 + 1.05 * pow(.5 - .5 * cos(2.618 * uTime), 1.25);
        float ax = abs(p.x), w = clamp((ax - .012 * uHalf) / (.03 * uHalf), 0.0, 1.0), a = th * w;
        p = vec3(sign(p.x) * ax * cos(a), p.y + .015 * uHalf * sin(2.618 * uTime + 1.2), p.z + ax * sin(a) * .95);
      } else {                                    // breathe: a slow swell that travels across the shape
        p.y += sin(uTime * .9 + p.x * .7) * .012 * uHalf; p.z += cos(uTime * .7 + p.y * .8) * .03;
      }
      return p * uK + uOff;
    }
    vec3 restMove(vec3 p){ p.y += sin(uTime * .9 + p.x * .7) * .012 * uHalf; return p * uK + uOff; }`;

  function create(container, opts) {
    const o = Object.assign({}, DEFAULTS, opts || {});
    const DPR = Math.min(root.devicePixelRatio || 1, 2);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: false });
    renderer.setPixelRatio(DPR); renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
    camera.position.set(0, 0, 11);
    const reduce = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seed = 1;
    const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const gauss = () => Math.sqrt(-2 * Math.log(Math.max(1e-6, rnd()))) * Math.cos(6.2831853 * rnd());
    const sprite = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
      const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.22, 'rgba(255,255,255,.8)');
      g.addColorStop(.55, 'rgba(255,255,255,.16)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
    const U = { uTime: { value: 0 }, uMotion: { value: 0 }, uK: { value: 1 }, uHalf: { value: SPAN / 2 }, uOff: { value: new THREE.Vector3() },
      uMorph: { value: 0 }, uScale: { value: 1 }, uGain: { value: 1 }, uMap: { value: sprite } };

    /* grains */
    const geo = new THREE.BufferGeometry();
    const mat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: U,
      vertexShader: `${MOVE}
        attribute vec3 aB, aCA, aCB; attribute float aLA, aLB; attribute vec4 aR; uniform float uMorph, uScale;
        varying vec3 vCol; varying float vA;
        void main(){
          vec3 a = shapeMove(position), b = restMove(aB);
          float k = clamp(uMorph * 1.45 - aR.x * .6, 0.0, 1.0); k = k * k * (3.0 - 2.0 * k);
          float s = sin(k * 3.14159);
          float rho = (.15 + 3.1 * pow(fract(aR.w * 1.618), .75)) * (1.0 + (fract(aR.w * 13.7) - .5) * .25) * uHalf / 3.9;
          float arm = floor(fract(aR.y * .159) * 4.0) * 1.5708;
          float th = arm + 2.3 * log(rho + .2) - uTime * (1.4 + 1.2 / (rho + .5)) + (fract(aR.w * 7.3) - .5) * .75;
          vec3 vort = vec3(cos(th) * rho, sin(th) * rho * .62, sin(th) * rho * .3) * uK + uOff;
          vort += vec3(sin(th * 3.0 + aR.y + uTime), cos(th * 2.0 + aR.y * 1.7 - uTime), 0.0) * .08 * rho;
          float pull = smoothstep(0.0, 1.0, s * 1.15) * .9;
          vec3 p = mix(mix(a, b, k), vort, pull);
          float core = (1.0 - smoothstep(0.0, 1.2, rho)) * pull;
          vCol = mix(aCA, aCB, k) * (1.0 + s * .3 + core * 1.0);
          vA = (.36 + mix(aLA, aLB, k) * .8) * (.75 + .25 * sin(uTime * 4.0 + aR.w * 9.0));
          vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
          gl_PointSize = max(1.0, aR.z * (1.0 + s * .6) * uScale / -mv.z);
        }`,
      fragmentShader: `uniform sampler2D uMap; uniform float uGain; varying vec3 vCol; varying float vA;
        void main(){ float a = texture2D(uMap, gl_PointCoord).a * vA * uGain; if (a < .004) discard; gl_FragColor = vec4(vCol, a); }` });
    const points = new THREE.Points(geo, mat); points.frustumCulled = false; scene.add(points);

    /* glow layers */
    const glowMat = which => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: Object.assign({ map: { value: null }, uOp: { value: 0 }, uPal: { value: 0 },
        uS0: { value: new THREE.Color() }, uS1: { value: new THREE.Color() }, uS2: { value: new THREE.Color() }, uS3: { value: new THREE.Color() } }, U),
      vertexShader: `${MOVE} varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(${which ? 'restMove' : 'shapeMove'}(position), 1.0); }`,
      fragmentShader: `uniform sampler2D map; uniform float uOp, uPal; uniform vec3 uS0, uS1, uS2, uS3; varying vec2 vUv;
        vec3 pal(float l){ l = clamp(l, 0.0, .999) * 3.0; return l < 1.0 ? mix(uS0, uS1, l) : l < 2.0 ? mix(uS1, uS2, l - 1.0) : mix(uS2, uS3, l - 2.0); }
        void main(){ vec2 d = min(vUv, 1.0 - vUv); float f = smoothstep(0.0, .22, d.x) * smoothstep(0.0, .22, d.y);
          vec3 c = max(texture2D(map, vUv).rgb - .07, 0.0) / .93;
          if (uPal > .5) c = pal(dot(c, vec3(.3, .55, .15)) * 1.1) * dot(c, vec3(.3, .55, .15)) * 1.6;
          gl_FragColor = vec4(c * c * 1.3 * uOp * f, 1.0); }` });
    const glows = [0, 1].map(i => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 120, 80), glowMat(i)); m.visible = false; m.renderOrder = -1; scene.add(m); return m; });

    /* bokeh */
    const BMAX = 150, bg = new THREE.BufferGeometry(), BP = new Float32Array(BMAX * 3), BS = new Float32Array(BMAX), BA = new Float32Array(BMAX), bm = [];
    for (let i = 0; i < BMAX; i++) { const z = -3 + rnd() * 5.5; bm.push({ x: (rnd() - .5) * 16, y: (rnd() - .5) * 8, z, s: rnd() * 6.28, sp: .03 + rnd() * .08 });
      BS[i] = z > 1.2 ? 22 + rnd() * 34 : 5 + rnd() * 14; BA[i] = z > 1.2 ? .04 + rnd() * .05 : .08 + rnd() * .18; }
    const BS0 = BS.slice();
    bg.setAttribute('position', new THREE.BufferAttribute(BP, 3)); bg.setAttribute('aS', new THREE.BufferAttribute(BS, 1)); bg.setAttribute('aA', new THREE.BufferAttribute(BA, 1));
    const bmat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uMap: { value: sprite }, uScale: { value: 1 }, uC: { value: new THREE.Color(1, .75, .4) } },
      vertexShader: `attribute float aS, aA; uniform float uScale; varying float vA; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * mv; gl_PointSize = aS * uScale / -mv.z; vA = aA; }`,
      fragmentShader: `uniform sampler2D uMap; uniform vec3 uC; varying float vA; void main(){ float a = smoothstep(0.0, .35, texture2D(uMap, gl_PointCoord).a) * vA; gl_FragColor = vec4(uC, a); }` });
    const bokeh = new THREE.Points(bg, bmat); bokeh.frustumCulled = false; scene.add(bokeh);

    /* sampling */
    let H = 604, imgs = [null, null], built = false, destroyed = false;
    const load = src => new Promise(res => { if (!src) return res(null); const im = new Image(); im.crossOrigin = 'anonymous'; im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
    function drawContain(im, w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
      const k = Math.min(w / im.width, h / im.height), dw = im.width * k, dh = im.height * k; g.drawImage(im, (w - dw) / 2, (h - dh) / 2, dw, dh); return c; }
    function boxBlur(src, r) { const tmp = new Float32Array(W * H), out = new Float32Array(W * H), k = 1 / (2 * r + 1);
      for (let y = 0; y < H; y++) { let s = 0; for (let x = -r; x <= r; x++) s += src[y * W + Math.min(W - 1, Math.max(0, x))];
        for (let x = 0; x < W; x++) { tmp[y * W + x] = s * k; s += src[y * W + Math.min(W - 1, x + r + 1)] - src[y * W + Math.max(0, x - r)]; } }
      for (let x = 0; x < W; x++) { let s = 0; for (let y = -r; y <= r; y++) s += tmp[Math.min(H - 1, Math.max(0, y)) * W + x];
        for (let y = 0; y < H; y++) { out[y * W + x] = s * k; s += tmp[Math.min(H - 1, y + r + 1) * W + x] - tmp[Math.max(0, y - r) * W + x]; } }
      return out; }
    function sampler(canvas) { const C = canvas.getContext('2d').getImageData(0, 0, W, H).data, L = new Float32Array(W * H);
      for (let i = 0; i < W * H; i++) L[i] = (C[i * 4] * .3 + C[i * 4 + 1] * .55 + C[i * 4 + 2] * .15) / 255;
      const B = boxBlur(boxBlur(L, 6), 6), w = new Float32Array(W * H); let tot = 0;
      for (let i = 0; i < W * H; i++) { const x = i % W, y = (i / W) | 0, e = Math.min(1, Math.min(x, W - x) / 60) * Math.min(1, Math.min(y, H - y) / 50);
        tot += Math.pow(Math.max(0, L[i] - o.threshold), 1.35) * (.3 + Math.max(0, L[i] - B[i]) * 5) * e * e; w[i] = tot; }
      return { C, L, w, tot }; }
    function pick(S, pos, col, lum, i, stops) {
      if (!S.tot) { pos.set([gauss() * 2, gauss(), 0], i * 3); col.set([.5, .5, .5], i * 3); lum[i] = .2; return; }
      const r = rnd() * S.tot; let lo = 0, hi = W * H - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (S.w[m] < r) lo = m + 1; else hi = m; }
      const px = lo % W + Math.random(), py = Math.floor(lo / W) + Math.random(), l = S.L[lo];
      pos.set([(px / W - .5) * SPAN, -(py / H - .5) * SPAN * H / W, gauss() * .06 + l * .2], i * 3);
      const pr = S.C[lo * 4] / 255, pg = S.C[lo * 4 + 1] / 255, pb = S.C[lo * 4 + 2] / 255, mx = Math.max(pr, pg, pb, .05);
      if (o.palette === 'original') col.set([Math.min(1, pr / mx * (.55 + l * .6)), Math.min(1, pg / mx * (.55 + l * .6)), Math.min(1, pb / mx * (.55 + l * .6))], i * 3);
      else { const k = Math.min(.999, Math.max(0, l * 1.15 + gauss() * .07)) * 3, j = k | 0; col.set(mixc(stops[j], stops[j + 1], k - j), i * 3); }
      lum[i] = l;
    }
    async function build() {
      const [A, B] = await Promise.all([load(o.imageA), load(o.imageB)]); if (destroyed) return;
      imgs = [A, B]; if (!A) return;
      H = Math.max(200, Math.min(900, Math.round(W * A.height / A.width)));
      const cA = drawContain(A, W, H), cB = B ? drawContain(B, W, H) : null, SA = sampler(cA), SB = cB ? sampler(cB) : SA, stops = stopsFor(o);
      const N = Math.round(Math.max(5000, Math.min(250000, o.count)));
      const PA = new Float32Array(N * 3), PB = new Float32Array(N * 3), CA = new Float32Array(N * 3), CB = new Float32Array(N * 3), LA = new Float32Array(N), LB = new Float32Array(N), R = new Float32Array(N * 4);
      seed = 7;
      for (let i = 0; i < N; i++) {
        pick(SA, PA, CA, LA, i, stops);
        if (cB) pick(SB, PB, CB, LB, i, stops); else { PB[i * 3] = PA[i * 3]; PB[i * 3 + 1] = PA[i * 3 + 1]; PB[i * 3 + 2] = PA[i * 3 + 2]; CB.set(CA.subarray(i * 3, i * 3 + 3), i * 3); LB[i] = LA[i]; }
        // leading edge (the right) leaves first; each grain gets a spiral arm, a size and a twinkle phase
        R[i * 4] = .62 * (1 - Math.max(0, Math.min(1, (PA[i * 3] + SPAN / 2) / SPAN))) + rnd() * .1; R[i * 4 + 1] = rnd() * 6.283;
        R[i * 4 + 2] = (.019 + Math.pow(rnd(), 3) * .045) * (rnd() < .012 ? 2.4 : 1); R[i * 4 + 3] = rnd() * 6.283;
      }
      for (const [k, v, n] of [['position', PA, 3], ['aB', PB, 3], ['aCA', CA, 3], ['aCB', CB, 3], ['aLA', LA, 1], ['aLB', LB, 1], ['aR', R, 4]]) geo.setAttribute(k, new THREE.BufferAttribute(v, n));
      [A, B].forEach((im, i) => { const g = glows[i]; if (g.material.uniforms.map.value) g.material.uniforms.map.value.dispose();
        g.material.uniforms.map.value = im ? new THREE.CanvasTexture(drawContain(im, W * 2, H * 2)) : null;
        g.geometry.dispose(); g.geometry = new THREE.PlaneGeometry(SPAN, SPAN * H / W, 120, 80); g.visible = !!im; });
      built = true; style(); fit();
    }
    function style() {
      const stops = stopsFor(o), usePal = o.palette !== 'original';
      glows.forEach(g => { const u = g.material.uniforms; u.uPal.value = usePal ? 1 : 0; ['uS0', 'uS1', 'uS2', 'uS3'].forEach((k, i) => u[k].value.setRGB(...stops[i])); });
      bmat.uniforms.uC.value.setRGB(...(usePal ? stops[2] : [1, .78, .45]));
      U.uMotion.value = MOTIONS[o.motion] || 0; U.uGain.value = o.brightness;
      for (let i = 0; i < BMAX; i++) BS[i] = i < o.bokeh ? BS0[i] : 0; bg.attributes.aS.needsUpdate = true;
      const transparent = o.background === 'transparent';
      renderer.setClearColor(transparent ? 0 : new THREE.Color(o.background), transparent ? 0 : 1);
    }
    let halfW = 1, halfH = 1;
    function fit() {
      const w = container.clientWidth || 1, h = container.clientHeight || 1; renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      halfH = Math.tan(17 * Math.PI / 180) * 11; halfW = halfH * camera.aspect;
      const contentH = SPAN * H / W, glide = o.motion === 'glide';
      const k = Math.min(halfW * 2 * (glide ? .5 : .84) / SPAN, halfH * 2 * .84 / contentH);
      U.uK.value = k; U.uHalf.value = SPAN / 2;
      const s = h * DPR * .5; U.uScale.value = s * 1.1 * o.grain * (.55 + .45 * Math.min(1, k)); bmat.uniforms.uScale.value = s * .06;
    }
    const sm = (a, b, x) => { const q = Math.max(0, Math.min(1, (x - a) / (b - a))); return q * q * (3 - 2 * q); };
    function frame(t) {
      const motion = o.motion; let m = 0, gA = 1, gB = 0;
      if (motion === 'morph') { const lt = t % 10; m = lt < 2.5 ? 0 : lt < 5.5 ? sm(2.5, 5.5, lt) : lt < 8 ? 1 : 1 - sm(8, 10, lt); gA = 1 - sm(0, .28, m); gB = sm(.8, 1, m); }
      else if (motion === 'dissolve') { const lt = t % 8; m = lt < 2.5 ? 0 : sm(2.5, 8, lt); gA = 1 - sm(0, .3, Math.sin(Math.PI * m)); }
      U.uMorph.value = m; U.uTime.value = t;
      glows[0].material.uniforms.uOp.value = o.glow * gA; glows[1].material.uniforms.uOp.value = o.glow * gB;
      if (motion === 'glide') { const span = halfW + SPAN * U.uK.value / 2 + .6, u = (t % 22) / 22; U.uOff.value.set(-span + u * span * 2, Math.sin(u * Math.PI * 2 + .6) * .35, 0); }
      else U.uOff.value.set(Math.sin(t * .2) * .08, Math.sin(t * .27) * .06, 0);
      for (let i = 0; i < BMAX; i++) { const q = bm[i]; BP[i * 3] = q.x + Math.sin(t * q.sp + q.s) * .5; BP[i * 3 + 1] = q.y + Math.cos(t * q.sp * .8 + q.s) * .3; BP[i * 3 + 2] = q.z; }
      bg.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    }
    let raf = 0, clock = 0, last = performance.now(), paused = false;
    function loop(now) { raf = requestAnimationFrame(loop); const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (!built || paused || document.hidden) return; clock += dt * o.speed; frame(clock); }
    const onMsg = e => { const d = String(e.data); if (/:pause$/.test(d)) paused = true; if (/:play$/.test(d)) paused = false; };
    root.addEventListener('message', onMsg);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { fit(); if (reduce && built) frame(1.2); }) : null; if (ro) ro.observe(container);
    const ready = build().then(() => { if (reduce) frame(1.2); else raf = requestAnimationFrame(loop); });
    return {
      ready,
      set(next) {
        const rebuild = ['imageA', 'imageB', 'count', 'threshold', 'palette', 'tint'].some(k => k in next && next[k] !== o[k]);
        Object.assign(o, next);
        if (rebuild) return build().then(() => { if (reduce) frame(1.2); });
        style(); fit(); if (reduce && built) frame(1.2); return Promise.resolve();
      },
      still(t) { frame(t); },
      destroy() { destroyed = true; cancelAnimationFrame(raf); root.removeEventListener('message', onMsg); if (ro) ro.disconnect(); renderer.dispose(); renderer.domElement.remove(); },
      get options() { return Object.assign({}, o); }
    };
  }
  root.ParticleEngine = { create, DEFAULTS, PALETTES };
})(typeof window !== 'undefined' ? window : this);
