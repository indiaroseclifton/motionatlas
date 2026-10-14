/* Adapted from India's uploaded Genesis composition, 2026-10-14.
   Original Fourier shapes and Three.js wireframe geometry retained.
   Changes: scoped lifecycle, cached sampled contours, accessible HTML controls,
   no baked captions, shifted hero composition, opt-in original film audio. */
'use strict';
window.GenesisScene={mount(stageCanvas,onChange){
 const W=1920,H=1080,DURATION=40;
 stageCanvas.width=W;stageCanvas.height=H;
 const ctx=stageCanvas.getContext('2d');
 const progressHairline=null;
 let cameraUserYaw=0,cameraUserPitch=0,targetUserYaw=0,targetUserPitch=0;
function smoothstep(edge0, edge1, x) {
  const t = Math.max(0.0, Math.min(1.0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3.0 - 2.0 * t);
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function cubicBezier(p0, p1, p2, p3, t) {
  const u = 1.0 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;
  return {
    x: uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0],
    y: uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1]
  };
}

function sampleBezierSpline(segments, stepsPerSegment = 18) {
  const pts = [];
  for (let i = 0; i < segments.length; i++) {
    const [p0, p1, p2, p3] = segments[i];
    for (let s = 0; s < stepsPerSegment; s++) {
      pts.push(cubicBezier(p0, p1, p2, p3, s / stepsPerSegment));
    }
  }
  return pts;
}

function resampleArcLength(pts, N) {
  const segDists = [];
  let totalLen = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    segDists.push(d);
    totalLen += d;
  }

  const uniform = [];
  let segIdx = 0;
  let accum = 0;
  for (let k = 0; k < N; k++) {
    const target = (k / N) * totalLen;
    while (segIdx < pts.length - 1 && accum + segDists[segIdx] < target) {
      accum += segDists[segIdx];
      segIdx++;
    }
    const a = pts[segIdx];
    const b = pts[(segIdx + 1) % pts.length];
    const d = segDists[segIdx];
    const ratio = d > 1e-6 ? (target - accum) / d : 0;
    uniform.push({
      re: a.x + (b.x - a.x) * ratio,
      im: a.y + (b.y - a.y) * ratio
    });
  }
  return uniform;
}

function computeDFT(samples, numHarmonics) {
  const N = samples.length;
  const coeffs = [];
  const half = Math.floor(numHarmonics / 2);

  for (let freq = -half; freq <= half; freq++) {
    let re = 0.0;
    let im = 0.0;
    const factor = (2.0 * Math.PI * freq) / N;
    for (let n = 0; n < N; n++) {
      const phi = factor * n;
      const cos = Math.cos(phi);
      const sin = Math.sin(phi);
      re += samples[n].re * cos + samples[n].im * sin;
      im += samples[n].im * cos - samples[n].re * sin;
    }
    re /= N;
    im /= N;
    const amp = Math.hypot(re, im);
    const phase = Math.atan2(im, re);
    coeffs.push({ re, im, freq, amp, phase });
  }

  const dc = coeffs.find(c => c.freq === 0);
  const rest = coeffs.filter(c => c.freq !== 0).sort((a, b) => b.amp - a.amp);
  return dc ? [dc, ...rest] : rest;
}

function rawFourierPoint(cx, cy, terms, phi) {
  let x = cx;
  let y = cy;
  for (let i = 0; i < terms.length; i++) {
    const c = terms[i];
    const angle = c.freq * phi + c.phase;
    x += c.amp * Math.cos(angle);
    y += c.amp * Math.sin(angle);
  }
  return { x, y };
}

// ============================================================================
// 3. 2D FOURIER BLUEPRINT SHAPES (Acts I & II: Earth, Oak Tree, Rose Bud, Willow, Stag, Bird)
// ============================================================================

/**
 * 1. PRIMORDIAL EARTH GLOBE & CONTINENTAL MERIDIAN BLUEPRINT (Center Stage)
 */
function buildEarthBlueprintDFT() {
  const pts = [];
  const N = 360;
  const R = 215;
  for (let i = 0; i < N; i++) {
    const theta = (i / N) * Math.PI * 2;
    const continentWave =
      18 * Math.sin(3 * theta + 0.5) +
      14 * Math.cos(5 * theta - 0.8) +
      9 * Math.sin(8 * theta + 1.2);
    const r = R + continentWave * Math.pow(Math.sin(theta * 1.5), 2);
    pts.push({
      re: r * Math.cos(theta),
      im: r * Math.sin(theta)
    });
  }
  return computeDFT(pts, 140);
}

/**
 * 2. MAJESTIC BRANCHING OAK TREE & ROOT SYSTEM BLUEPRINT (Far Left Harmonic Node)
 */
function buildOakTreeBlueprintDFT() {
  const S = 1.95;
  const ox = -615;
  const oy = 45;
  const P = (x, y) => [x * S + ox, y * S + oy];

  // Continuous closed silhouette tracing spreading roots, trunk, boughs, and billowy oak crown
  const segments = [
    // Bottom center root Tap -> Left spreading roots
    [P(0, 68), P(-12, 68), P(-28, 74), P(-44, 78)],
    [P(-44, 78), P(-32, 66), P(-18, 56), P(-14, 42)],
    // Left gnarled trunk ascending to lower left bough
    [P(-14, 42), P(-12, 20), P(-13, -2), P(-22, -16)],
    // Left sweeping lower branch & foliage cluster
    [P(-22, -16), P(-48, -18), P(-74, -12), P(-86, -26)],
    [P(-86, -26), P(-96, -42), P(-82, -62), P(-62, -64)],
    // Upper left canopy billow
    [P(-62, -64), P(-68, -82), P(-48, -98), P(-24, -94)],
    // Top crown apex
    [P(-24, -94), P(-10, -108), P(12, -108), P(26, -94)],
    // Upper right canopy billow
    [P(26, -94), P(50, -98), P(70, -82), P(64, -62)],
    // Right sweeping bough & foliage lobe
    [P(64, -62), P(86, -58), P(96, -38), P(82, -22)],
    [P(82, -22), P(68, -10), P(44, -16), P(22, -14)],
    // Right trunk descending to flared right roots
    [P(22, -14), P(13, 0), P(12, 22), P(15, 44)],
    [P(15, 44), P(20, 58), P(34, 68), P(46, 78)],
    [P(46, 78), P(28, 74), P(12, 68), P(0, 68)]
  ];

  const sampled = resampleArcLength(sampleBezierSpline(segments, 18), 340);
  return computeDFT(sampled, 145);
}

/**
 * 3. SPIRALING ROSE BUD & THORNY STEM BLUEPRINT (Inner Left Harmonic Node)
 */
function buildRoseBudBlueprintDFT() {
  const S = 1.85;
  const ox = -335;
  const oy = -155;
  const P = (x, y) => [x * S + ox, y * S + oy];

  // Stem, serrated rose leaf, calyx sepals, and spiraling logarithmic rose bud petals
  const segments = [
    // Base of stem ascending with a thorn & left rose leaf
    [P(0, 72), P(-2, 52), P(-4, 36), P(-16, 28)],
    [P(-16, 28), P(-38, 26), P(-52, 14), P(-42, 4)],
    [P(-42, 4), P(-28, 6), P(-14, 14), P(-4, 20)],
    // Left sepal & outer unfurling rose petal
    [P(-4, 20), P(-18, 8), P(-32, -8), P(-30, -28)],
    [P(-30, -28), P(-28, -48), P(-14, -64), P(0, -68)],
    // Inner spiraling rose bud whorl (heart of the rose)
    [P(0, -68), P(14, -62), P(22, -46), P(12, -34)],
    [P(12, -34), P(2, -24), P(-12, -30), P(-10, -44)],
    [P(-10, -44), P(-6, -54), P(8, -54), P(16, -42)],
    // Right outer rose petal & calyx
    [P(16, -42), P(30, -52), P(34, -30), P(28, -10)],
    [P(28, -10), P(20, 6), P(8, 14), P(4, 22)],
    // Right rose leaf & thorn back to stem base
    [P(4, 22), P(18, 16), P(38, 14), P(46, 24)],
    [P(46, 24), P(34, 34), P(16, 34), P(4, 38)],
    [P(4, 38), P(3, 54), P(2, 64), P(0, 72)]
  ];

  const sampled = resampleArcLength(sampleBezierSpline(segments, 18), 320);
  return computeDFT(sampled, 135);
}

/**
 * 4. WEEPING WILLOW & FIDDLEHEAD FERN FROND BLUEPRINT (Inner Right Harmonic Node)
 */
function buildWillowFernBlueprintDFT() {
  const pts = [];
  const N = 320;
  const ox = 335;
  const oy = -155;
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    // Golden-ratio spiral fern frond + weeping willow cascade modulation
    const frondPinnae = Math.sin(9.0 * t) * 24.0 * Math.pow(Math.sin(t * 0.5), 1.3);
    const baseSpiral = 42.0 + 58.0 * Math.sin(t * 0.5);
    const r = baseSpiral + frondPinnae;
    pts.push({
      re: r * Math.cos(t - 0.4) + ox,
      im: r * 1.18 * Math.sin(t - 0.4) + oy
    });
  }
  return computeDFT(pts, 130);
}

/**
 * 5. CELESTIAL LEAPING STAG / WILDLIFE SILHOUETTE (Far Right Harmonic Node)
 */
function buildWildlifeStagDFT() {
  const S = 1.98;
  const ox = 615;
  const oy = 55;
  const P = (x, y) => [x * S + ox, y * S + oy];

  const segments = [
    [P(-52, -26), P(-56, -30), P(-50, -35), P(-42, -37)],
    [P(-42, -37), P(-36, -54), P(-24, -72), P(-8, -82)],
    [P(-8, -82), P(-14, -70), P(-18, -58), P(-24, -52)],
    [P(-24, -52), P(-14, -62), P(-2, -68), P(8, -70)],
    [P(8, -70), P(-2, -58), P(-16, -46), P(-28, -36)],
    [P(-28, -36), P(-20, -40), P(-16, -32), P(-22, -26)],
    [P(-22, -26), P(-10, -16), P(6, -14), P(24, -15)],
    [P(24, -15), P(42, -16), P(56, -12), P(66, -4)],
    [P(66, -4), P(74, 2), P(72, 10), P(62, 12)],
    [P(62, 12), P(68, 28), P(78, 46), P(86, 58)],
    [P(86, 58), P(80, 60), P(68, 44), P(54, 26)],
    [P(54, 26), P(44, 20), P(34, 16), P(20, 15)],
    [P(20, 15), P(2, 16), P(-14, 14), P(-26, 8)],
    [P(-26, 8), P(-40, 22), P(-56, 36), P(-68, 42)],
    [P(-68, 42), P(-72, 38), P(-58, 22), P(-42, 4)],
    [P(-42, 4), P(-48, -6), P(-46, -18), P(-52, -26)]
  ];

  const sampled = resampleArcLength(sampleBezierSpline(segments, 18), 320);
  return computeDFT(sampled, 140);
}

/**
 * 6. SOARING PHOENIX / DOVE OF LIFE SILHOUETTE (Top Crown Harmonic Node)
 */
function buildSoaringBirdDFT(t = 0) {
  const S = 1.85;
  const ox = 0;
  const oy = -275;
  const wingBeat = Math.sin(t * 5.0) * 14.0;
  const P = (x, y, isWing = false) => [
    x * S + ox,
    (y + (isWing ? wingBeat : 0)) * S + oy
  ];

  const segments = [
    [P(0, -34), P(5, -28), P(8, -22), P(12, -18)],
    [P(12, -18), P(38, -36, true), P(76, -54, true), P(112, -46, true)],
    [P(112, -46, true), P(96, -24, true), P(68, -8, true), P(32, 4)],
    [P(32, 4), P(22, 28), P(12, 48), P(0, 56)],
    [P(0, 56), P(-12, 48), P(-22, 28), P(-32, 4)],
    [P(-32, 4), P(-68, -8, true), P(-96, -24, true), P(-112, -46, true)],
    [P(-112, -46, true), P(-76, -54, true), P(-38, -36, true), P(-12, -18)],
    [P(-12, -18), P(-8, -22), P(-5, -28), P(0, -34)]
  ];

  const sampled = resampleArcLength(sampleBezierSpline(segments, 16), 280);
  return computeDFT(sampled, 110);
}

const earthTerms = buildEarthBlueprintDFT();
const oakTreeTerms = buildOakTreeBlueprintDFT();
const roseBudTerms = buildRoseBudBlueprintDFT();
const willowFernTerms = buildWillowFernBlueprintDFT();
const stagTerms = buildWildlifeStagDFT();

// ============================================================================
// 4. THREE.JS PURE 3D LINE-ART & WIREFRAME ENGINE (Zero Filled Polygons!)
//    All 3D objects use THREE.Line, THREE.LineLoop, THREE.LineSegments & AdditiveBlending
// ============================================================================
const webglCanvas = document.createElement('canvas');
webglCanvas.width = W;
webglCanvas.height = H;

let renderMode='WebGL';let renderer;
try{const probe=document.createElement('canvas');if(!probe.getContext('webgl2')&&!probe.getContext('webgl'))throw Error('WebGL unavailable');renderer=new THREE.WebGLRenderer({canvas:webglCanvas,antialias:true,alpha:true});renderer.setSize(W,H);renderer.setPixelRatio(1);}catch{
 renderMode='Canvas';const wire=webglCanvas.getContext('2d');const p=new THREE.Vector3();
 renderer={render(scene,camera){wire.clearRect(0,0,W,H);scene.updateMatrixWorld(true);camera.updateMatrixWorld();camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
 scene.traverseVisible(obj=>{if(!obj.isLine||!obj.geometry)return;const mat=obj.material;if(!mat||mat.opacity<.005)return;const pos=obj.geometry.getAttribute('position');if(!pos)return;
 wire.strokeStyle='#'+mat.color.getHexString();wire.globalAlpha=mat.opacity;wire.globalCompositeOperation='lighter';wire.lineWidth=1.1;wire.beginPath();let valid=false;
 for(let i=0;i<pos.count;i++){p.fromBufferAttribute(pos,i).applyMatrix4(obj.matrixWorld).project(camera);const x=(p.x*.5+.5)*W,y=(-p.y*.5+.5)*H;const inside=Number.isFinite(x)&&Number.isFinite(y)&&p.z>=-1&&p.z<=1;
 if(!inside){valid=false;continue;}if(obj.isLineSegments){if(i%2===0){wire.moveTo(x,y);valid=true;}else if(valid){wire.lineTo(x,y);valid=false;}}else{if(valid)wire.lineTo(x,y);else wire.moveTo(x,y);valid=true;}}
 if(obj.isLineLoop&&valid)wire.closePath();wire.stroke();});wire.globalAlpha=1;wire.globalCompositeOperation='source-over';}};
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 1000);

// ----------------------------------------------------------------------------
// 4A. PURE 3D VECTOR LINE-ART EARTH GLOBE (Meridians, Parallels, Glowing Continents)
// ----------------------------------------------------------------------------
const earthGroup = new THREE.Group();
scene.add(earthGroup);

const earthLineMaterials = [];

// 1. Latitude & Longitude Geodesic Wireframe Sphere
const globeSphereGeo = new THREE.SphereGeometry(4.2, 28, 18);
const globeWireGeo = new THREE.WireframeGeometry(globeSphereGeo);
const globeWireMat = new THREE.LineBasicMaterial({
  color: 0x7dd3fc, // Soft Ice Cyan
  transparent: true,
  opacity: 0,
  blending: THREE.AdditiveBlending
});
earthLineMaterials.push({ mat: globeWireMat, maxAlpha: 0.16 });
const globeWireLines = new THREE.LineSegments(globeWireGeo, globeWireMat);
earthGroup.add(globeWireLines);

// 2. Inner Core Sacred Icosahedron Line Cage
const innerCoreGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(3.88, 1));
const innerCoreMat = new THREE.LineBasicMaterial({
  color: 0xa5b4fc, // Muted Periwinkle
  transparent: true,
  opacity: 0,
  blending: THREE.AdditiveBlending
});
earthLineMaterials.push({ mat: innerCoreMat, maxAlpha: 0.11 });
const innerCoreLines = new THREE.LineSegments(innerCoreGeo, innerCoreMat);
earthGroup.add(innerCoreLines);

// 3. Glowing Continental Topographic Vector Loops on the 3D Sphere Surface
function createContinentalContourLoops() {
  const continentGroup = new THREE.Group();
  const R = 4.22;

  // 12 clean, uncluttered topographic vector contours across the globe
  for (let c = 0; c < 12; c++) {
    const seed = c * 47.19;
    const centerLat = ((seed % 1.0) - 0.5) * 2.0;
    const centerLon = (c / 12) * Math.PI * 2;
    const baseRadius = 0.25 + (c % 3) * 0.09;

    // 2 concentric elevation contour rings per landmass for visual clarity
    for (let ring = 0; ring < 2; ring++) {
      const rScale = baseRadius * (1.0 - ring * 0.32);
      const pts = [];
      const segments = 56;

      for (let s = 0; s <= segments; s++) {
        const a = (s / segments) * Math.PI * 2;
        const coastlineMod =
          1.0 +
          0.26 * Math.sin(3 * a + seed) +
          0.16 * Math.cos(5 * a - seed * 1.7) +
          0.10 * Math.sin(8 * a + c);

        const dLat = rScale * coastlineMod * Math.sin(a);
        const dLon = (rScale * coastlineMod * Math.cos(a)) / Math.max(0.35, Math.cos(centerLat));

        const lat = centerLat + dLat;
        const lon = centerLon + dLon;

        const x = R * Math.cos(lat) * Math.cos(lon);
        const y = R * Math.sin(lat);
        const z = R * Math.cos(lat) * Math.sin(lon);
        pts.push(new THREE.Vector3(x, y, z));
      }

      const loopGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const loopColor = ring === 0 ? 0x6ee7b7 : 0xfde68a; // Soft Sage Emerald & Warm Champagne

      const loopMat = new THREE.LineBasicMaterial({
        color: loopColor,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      });
      earthLineMaterials.push({ mat: loopMat, maxAlpha: ring === 0 ? 0.48 : 0.30 });

      const lineLoop = new THREE.Line(loopGeo, loopMat);
      continentGroup.add(lineLoop);
    }
  }
  return continentGroup;
}
earthGroup.add(createContinentalContourLoops());

// 4. Prominent Glowing Equatorial, Tropic & Polar Meridian Rings
function createCelestialRingLoop(radius, segments, colorHex, maxAlpha) {
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  });
  earthLineMaterials.push({ mat, maxAlpha });
  return new THREE.Line(geo, mat);
}

const equatorRing = createCelestialRingLoop(4.26, 128, 0xfde68a, 0.45);
earthGroup.add(equatorRing);

// Dual Tilted Celestial Astrolabe Line Rings (Multi-line concentric tracks + ticks)
function createAstrolabeLineSystem(innerR, outerR, colorHex, secondaryHex) {
  const group = new THREE.Group();
  const r1 = createCelestialRingLoop(innerR, 140, colorHex, 0.38);
  const r2 = createCelestialRingLoop(outerR, 140, secondaryHex, 0.26);
  group.add(r1, r2);

  // Radial degree tick segments between innerR and outerR
  const tickPts = [];
  const numTicks = 48;
  for (let i = 0; i < numTicks; i++) {
    const a = (i / numTicks) * Math.PI * 2;
    const rIn = i % 6 === 0 ? innerR - 0.12 : innerR;
    const rOut = i % 6 === 0 ? outerR + 0.12 : outerR;
    tickPts.push(
      new THREE.Vector3(Math.cos(a) * rIn, 0, Math.sin(a) * rIn),
      new THREE.Vector3(Math.cos(a) * rOut, 0, Math.sin(a) * rOut)
    );
  }
  const tickGeo = new THREE.BufferGeometry().setFromPoints(tickPts);
  const tickMat = new THREE.LineBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  });
  earthLineMaterials.push({ mat: tickMat, maxAlpha: 0.25 });
  group.add(new THREE.LineSegments(tickGeo, tickMat));
  return group;
}

const orbitalRing1 = createAstrolabeLineSystem(5.45, 5.65, 0xfde68a, 0x7dd3fc);
orbitalRing1.rotation.x = Math.PI * 0.38;
orbitalRing1.rotation.y = 0.25;
earthGroup.add(orbitalRing1);

const orbitalRing2 = createAstrolabeLineSystem(6.35, 6.55, 0xfda4af, 0xc4b5fd);
orbitalRing2.rotation.x = -Math.PI * 0.34;
orbitalRing2.rotation.z = 0.42;
earthGroup.add(orbitalRing2);

// ----------------------------------------------------------------------------
// 4B. DIVERSE 3D WIREFRAME BOTANICAL ECOSYSTEM (Trees, Rose Buds & Lotus Chalices)
// ----------------------------------------------------------------------------
const flowersGroup = new THREE.Group();
scene.add(flowersGroup);

// 1. Sculpted 3D Lotus/Chalices Petal Wireframe Geometry
function createWireframePetalGeometry() {
  const vertices = [];
  const uSteps = 5;
  const vSteps = 12;

  function evalPetalPoint(uNorm, vNorm) {
    const ny = vNorm * 2.0;
    const taper = Math.sin(vNorm * Math.PI);
    const x = uNorm * 0.42 * taper;
    const z = Math.pow(ny * 0.5, 1.8) * 0.32 + (1.0 - uNorm * uNorm) * 0.08 * taper;
    const y = ny * 0.96;
    return new THREE.Vector3(x, y, z);
  }

  for (let iu = 0; iu < uSteps; iu++) {
    const u = -1.0 + (2.0 * iu) / (uSteps - 1);
    for (let iv = 0; iv < vSteps; iv++) {
      vertices.push(evalPetalPoint(u, iv / vSteps), evalPetalPoint(u, (iv + 1) / vSteps));
    }
  }
  for (let iv = 2; iv < vSteps; iv += 3) {
    const v = iv / vSteps;
    for (let iu = 0; iu < uSteps - 1; iu++) {
      const u0 = -1.0 + (2.0 * iu) / (uSteps - 1);
      const u1 = -1.0 + (2.0 * (iu + 1)) / (uSteps - 1);
      vertices.push(evalPetalPoint(u0, v), evalPetalPoint(u1, v));
    }
  }
  return new THREE.BufferGeometry().setFromPoints(vertices);
}

// 2. Cupped Spiraling Rose Bud Petal Wireframe Geometry (High-Curvature Rose Whorl)
function createWireframeRosePetalGeometry() {
  const vertices = [];
  const uSteps = 5;
  const vSteps = 12;

  function evalRosePoint(uNorm, vNorm) {
    const widthProfile = Math.sin(vNorm * Math.PI * 0.92);
    const cupWrap = uNorm * 1.15 * widthProfile;
    const radius = 0.38 * widthProfile + 0.08;
    const lipCurl = vNorm > 0.72 ? Math.pow((vNorm - 0.72) / 0.28, 2) * 0.22 : 0.0;
    const x = Math.sin(cupWrap) * (radius + lipCurl);
    const z = (1.0 - Math.cos(cupWrap)) * 0.36 + Math.pow(vNorm, 1.4) * 0.22 - lipCurl;
    const y = vNorm * 1.65;
    return new THREE.Vector3(x, y, z);
  }

  for (let iu = 0; iu < uSteps; iu++) {
    const u = -1.0 + (2.0 * iu) / (uSteps - 1);
    for (let iv = 0; iv < vSteps; iv++) {
      vertices.push(evalRosePoint(u, iv / vSteps), evalRosePoint(u, (iv + 1) / vSteps));
    }
  }
  for (let iv = 3; iv < vSteps; iv += 4) {
    const v = iv / vSteps;
    for (let iu = 0; iu < uSteps - 1; iu++) {
      const u0 = -1.0 + (2.0 * iu) / (uSteps - 1);
      const u1 = -1.0 + (2.0 * (iu + 1)) / (uSteps - 1);
      vertices.push(evalRosePoint(u0, v), evalRosePoint(u1, v));
    }
  }
  return new THREE.BufferGeometry().setFromPoints(vertices);
}

const sharedWirePetalGeo = createWireframePetalGeometry();
const sharedRosePetalGeo = createWireframeRosePetalGeometry();
const flowerInstances = [];

// Curated, balanced placement with soft Dusty Rose, Champagne Gold, and Ice Blue tones
const flowerConfigs = [
  // Centerpiece Foreground Spiraling Rose Bud
  { type: 'rose', pos: [0, -3.2, 6.6], rot: [0.34, 0, 0], scale: 1.38, color: 0xfda4af, rimColor: 0xfde68a, stemColor: 0x6ee7b7, delay: 0.0 },
  // Flanking Foreground Rose Buds
  { type: 'rose', pos: [-4.1, -2.4, 4.8], rot: [0.28, 0.38, -0.15], scale: 1.10, color: 0xf472b6, rimColor: 0xfecdd3, stemColor: 0x6ee7b7, delay: 0.10 },
  { type: 'rose', pos: [4.1, -2.4, 4.8], rot: [0.28, -0.38, 0.15], scale: 1.10, color: 0xfda4af, rimColor: 0xbae6fd, stemColor: 0x6ee7b7, delay: 0.14 },
  // Sacred Lotus Chalices
  { type: 'lotus', pos: [-6.4, -1.6, 3.2], rot: [0.25, 0.5, -0.2], scale: 0.98, color: 0x7dd3fc, rimColor: 0xc4b5fd, delay: 0.20 },
  { type: 'lotus', pos: [6.4, -1.6, 3.2], rot: [0.25, -0.5, 0.2], scale: 0.98, color: 0xfde68a, rimColor: 0xfda4af, delay: 0.24 },
  // Subtle Crown Blossom on the Rotating 3D Earth
  { type: 'rose', pos: [0, 4.25, 0], rot: [0, 0, 0], scale: 0.76, color: 0xfda4af, rimColor: 0xfde68a, delay: 0.28, onEarth: true }
];

flowerConfigs.forEach((cfg) => {
  const root = new THREE.Group();
  root.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
  root.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);

  const petals = [];

  if (cfg.type === 'rose') {
    const stemPts = [
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.05, -0.9, -0.05),
      new THREE.Vector3(0.05, -0.9, -0.05), new THREE.Vector3(-0.04, -1.9, 0.04),
      new THREE.Vector3(0.02, -0.45, 0), new THREE.Vector3(0.22, -0.38, 0.08),
      new THREE.Vector3(0.01, -1.15, 0), new THREE.Vector3(-0.22, -1.08, -0.06),
      new THREE.Vector3(0.02, -0.75, 0), new THREE.Vector3(-0.55, -0.55, 0.22),
      new THREE.Vector3(-0.55, -0.55, 0.22), new THREE.Vector3(-0.88, -0.68, 0.30),
      new THREE.Vector3(-0.88, -0.68, 0.30), new THREE.Vector3(-0.48, -0.88, 0.14),
      new THREE.Vector3(-0.48, -0.88, 0.14), new THREE.Vector3(0.02, -0.75, 0),
      new THREE.Vector3(0.04, -1.05, 0), new THREE.Vector3(0.58, -0.85, -0.18),
      new THREE.Vector3(0.58, -0.85, -0.18), new THREE.Vector3(0.92, -0.98, -0.25),
      new THREE.Vector3(0.92, -0.98, -0.25), new THREE.Vector3(0.50, -1.18, -0.10),
      new THREE.Vector3(0.50, -1.18, -0.10), new THREE.Vector3(0.04, -1.05, 0)
    ];
    for (let s = 0; s < 5; s++) {
      const sa = (s / 5) * Math.PI * 2;
      stemPts.push(
        new THREE.Vector3(0, 0.02, 0),
        new THREE.Vector3(Math.cos(sa) * 0.48, -0.18, Math.sin(sa) * 0.48)
      );
    }
    const stemGeo = new THREE.BufferGeometry().setFromPoints(stemPts);
    const stemMat = new THREE.LineBasicMaterial({
      color: cfg.stemColor || 0x6ee7b7,
      transparent: true,
      opacity: 0.48,
      blending: THREE.AdditiveBlending
    });
    root.add(new THREE.LineSegments(stemGeo, stemMat));

    // 16 Golden-Angle Spiraling Rose Petals for clean, sculptural elegance
    const numRosePetals = 16;
    const goldenAngle = 2.39996323;
    for (let p = 0; p < numRosePetals; p++) {
      const normP = p / (numRosePetals - 1);
      const pivot = new THREE.Group();
      pivot.rotation.y = p * goldenAngle;
      pivot.position.y = (1.0 - normP) * 0.14;

      const isInnerBud = p < 5;
      const mat = new THREE.LineBasicMaterial({
        color: isInnerBud ? cfg.rimColor : cfg.color,
        transparent: true,
        opacity: isInnerBud ? 0.68 : 0.48,
        blending: THREE.AdditiveBlending
      });

      const petalLines = new THREE.LineSegments(sharedRosePetalGeo, mat);
      const pScale = mix(0.46, 1.15, normP);
      petalLines.scale.setScalar(pScale);
      pivot.add(petalLines);
      root.add(pivot);

      petals.push({
        mesh: petalLines,
        tiltClosed: mix(0.06, 0.22, normP),
        tiltOpen: mix(0.24, 1.08, Math.pow(normP, 1.25)),
        layerIdx: Math.floor(normP * 3),
        petalIdx: p
      });
    }
  } else {
    const coreGeo = new THREE.WireframeGeometry(new THREE.OctahedronGeometry(0.30, 0));
    const coreMat = new THREE.LineBasicMaterial({
      color: 0xfde68a,
      transparent: true,
      opacity: 0.62,
      blending: THREE.AdditiveBlending
    });
    root.add(new THREE.LineSegments(coreGeo, coreMat));

    const layers = [
      { count: 6, tiltClosed: 0.16, tiltOpen: 0.56, scale: 0.72, yOff: 0.05 },
      { count: 8, tiltClosed: 0.24, tiltOpen: 1.02, scale: 1.02, yOff: -0.02 }
    ];

    layers.forEach((layer, lIdx) => {
      for (let p = 0; p < layer.count; p++) {
        const pivot = new THREE.Group();
        pivot.rotation.y = (p / layer.count) * Math.PI * 2 + lIdx * 0.35;
        pivot.position.y = layer.yOff;

        const mat = new THREE.LineBasicMaterial({
          color: lIdx === 0 ? cfg.rimColor : cfg.color,
          transparent: true,
          opacity: lIdx === 0 ? 0.62 : 0.45,
          blending: THREE.AdditiveBlending
        });

        const petalLines = new THREE.LineSegments(sharedWirePetalGeo, mat);
        petalLines.scale.setScalar(layer.scale);
        pivot.add(petalLines);
        root.add(pivot);

        petals.push({
          mesh: petalLines,
          tiltClosed: layer.tiltClosed,
          tiltOpen: layer.tiltOpen,
          layerIdx: lIdx,
          petalIdx: p
        });
      }
    });
  }

  if (cfg.onEarth) {
    earthGroup.add(root);
  } else {
    flowersGroup.add(root);
  }

  flowerInstances.push({
    root,
    petals,
    baseScale: cfg.scale,
    delay: cfg.delay,
    basePos: [...cfg.pos],
    onEarth: !!cfg.onEarth
  });
});

// ----------------------------------------------------------------------------
// 4B-2. MAJESTIC 3D RECURSIVE WIREFRAME TREES (Oak, Bonsai & Weeping Willow)
// ----------------------------------------------------------------------------
const treesGroup = new THREE.Group();
scene.add(treesGroup);
const treeInstances = [];

function create3DWireframeTree(cfg) {
  const treeRoot = new THREE.Group();
  treeRoot.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
  treeRoot.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);

  const trunkSegments = [];
  const canopySegments = [];

  // 1. Spreading Surface Root Ribbons
  const numRoots = 4;
  for (let r = 0; r < numRoots; r++) {
    const rAngle = (r / numRoots) * Math.PI * 2 + cfg.seed;
    let rx = 0, ry = 0, rz = 0;
    for (let step = 1; step <= 3; step++) {
      const nr = step * 0.30;
      const nx = Math.cos(rAngle + step * 0.18) * nr;
      const nz = Math.sin(rAngle + step * 0.18) * nr;
      const ny = -step * 0.12;
      trunkSegments.push(new THREE.Vector3(rx, ry, rz), new THREE.Vector3(nx, ny, nz));
      rx = nx; ry = ny; rz = nz;
    }
  }

  // 2. Recursive 3D Fractal Branching (Clean 4-level depth for graceful silhouettes)
  function buildBranch(startPt, dirVec, length, radius, depth) {
    const endPt = startPt.clone().add(dirVec.clone().multiplyScalar(length));

    const ribCount = depth >= 4 ? 2 : 1;
    for (let r = 0; r < ribCount; r++) {
      const a = (r / ribCount) * Math.PI * 2;
      const offStart = new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
      const offEnd = new THREE.Vector3(Math.cos(a + 0.3) * radius * 0.65, 0, Math.sin(a + 0.3) * radius * 0.65);
      trunkSegments.push(startPt.clone().add(offStart), endPt.clone().add(offEnd));
    }

    if (depth <= 1) {
      const frondCount = cfg.isWillow ? 3 : 2;
      for (let f = 0; f < frondCount; f++) {
        const fa = (f / frondCount) * Math.PI * 2 + depth;
        const leafTip = endPt.clone().add(new THREE.Vector3(
          Math.cos(fa) * 0.32,
          cfg.isWillow ? -0.58 : 0.24,
          Math.sin(fa) * 0.32
        ));
        canopySegments.push(endPt.clone(), leafTip);
      }
      return;
    }

    const numChildren = 2;
    for (let c = 0; c < numChildren; c++) {
      const spreadYaw = (c - 0.5) * 1.25 + (cfg.seed * 0.31) + c * 1.7;
      const tiltPitch = 0.44 + (c % 2) * 0.16;

      const childDir = dirVec.clone();
      childDir.x += Math.cos(spreadYaw) * Math.sin(tiltPitch);
      childDir.z += Math.sin(spreadYaw) * Math.sin(tiltPitch);
      childDir.y += 0.58;
      childDir.normalize();

      buildBranch(endPt, childDir, length * 0.76, radius * 0.65, depth - 1);
    }
  }

  buildBranch(new THREE.Vector3(0, 0, 0), new THREE.Vector3(cfg.leanX || 0.06, 1.0, 0.0), cfg.trunkLen, 0.12, 4);

  const trunkGeo = new THREE.BufferGeometry().setFromPoints(trunkSegments);
  const trunkMat = new THREE.LineBasicMaterial({
    color: cfg.trunkColor,
    transparent: true,
    opacity: 0.46,
    blending: THREE.AdditiveBlending
  });
  const trunkLines = new THREE.LineSegments(trunkGeo, trunkMat);
  treeRoot.add(trunkLines);

  const canopyGeo = new THREE.BufferGeometry().setFromPoints(canopySegments);
  const canopyMat = new THREE.LineBasicMaterial({
    color: cfg.canopyColor,
    transparent: true,
    opacity: 0.54,
    blending: THREE.AdditiveBlending
  });
  const canopyLines = new THREE.LineSegments(canopyGeo, canopyMat);
  treeRoot.add(canopyLines);

  if (cfg.onEarth) {
    earthGroup.add(treeRoot);
  } else {
    treesGroup.add(treeRoot);
  }

  treeInstances.push({
    root: treeRoot,
    trunkLines,
    canopyLines,
    baseScale: cfg.scale,
    delay: cfg.delay,
    basePos: [...cfg.pos],
    onEarth: !!cfg.onEarth
  });
}

const treeConfigs = [
  // Left Majestic Ancient Oak & Soft Sage Canopy
  { pos: [-7.5, -2.6, 2.2], rot: [0.10, 0.42, -0.06], scale: 1.25, trunkLen: 1.18, leanX: 0.10, trunkColor: 0xfde68a, canopyColor: 0x6ee7b7, seed: 1.2, delay: 0.05 },
  // Right Weeping Willow & Soft Rose-Blossom Canopy
  { pos: [7.5, -2.6, 2.2], rot: [0.10, -0.42, 0.06], scale: 1.25, trunkLen: 1.18, leanX: -0.10, trunkColor: 0xfed7aa, canopyColor: 0xfda4af, isWillow: true, seed: 2.7, delay: 0.12 },
  // Subtle Trees Growing Out of the Rotating 3D Earth Continents
  { pos: [-2.8, 2.8, 1.4], rot: [0.3, 0.0, 0.65], scale: 0.65, trunkLen: 0.85, leanX: 0.0, trunkColor: 0xfde68a, canopyColor: 0x6ee7b7, seed: 7.3, delay: 0.20, onEarth: true },
  { pos: [2.8, -2.6, 1.8], rot: [0.4, 0.0, -2.1], scale: 0.65, trunkLen: 0.85, leanX: 0.0, trunkColor: 0xfed7aa, canopyColor: 0xfda4af, isWillow: true, seed: 8.9, delay: 0.26, onEarth: true }
];
treeConfigs.forEach(create3DWireframeTree);

// ----------------------------------------------------------------------------
// 4B-3. SWIRLING 3D WIREFRAME ROSE PETALS & AUTUMN LEAVES (Act III & IV Wind)
// ----------------------------------------------------------------------------
const petalsWindGroup = new THREE.Group();
scene.add(petalsWindGroup);

const leafWireGeo = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0, -0.16, 0), new THREE.Vector3(0.10, 0, 0.03),
  new THREE.Vector3(0.10, 0, 0.03), new THREE.Vector3(0, 0.18, 0),
  new THREE.Vector3(0, 0.18, 0), new THREE.Vector3(-0.10, 0, -0.03),
  new THREE.Vector3(-0.10, 0, -0.03), new THREE.Vector3(0, -0.16, 0)
]);

const driftingLeaves = [];
const NUM_DRIFT_LEAVES = 24;
const leafColors = [0xfda4af, 0x6ee7b7, 0xfde68a, 0xbae6fd, 0xc4b5fd];

for (let i = 0; i < NUM_DRIFT_LEAVES; i++) {
  const mat = new THREE.LineBasicMaterial({
    color: leafColors[i % leafColors.length],
    transparent: true,
    opacity: 0.36,
    blending: THREE.AdditiveBlending
  });
  const mesh = new THREE.LineSegments(leafWireGeo, mat);
  petalsWindGroup.add(mesh);
  driftingLeaves.push({
    mesh,
    radius: 4.2 + (i % 8) * 0.62,
    speed: 0.24 + (i % 5) * 0.06,
    phase: (i / NUM_DRIFT_LEAVES) * Math.PI * 2,
    yBase: -3.2 + (i % 7) * 0.9,
    spinSpeed: 1.1 + (i % 4) * 0.45
  });
}

// ----------------------------------------------------------------------------
// 4C. SOARING 3D WIREFRAME BIRDS FLOCK + LUMINOUS RIBBON TRAILS (Pure Lines)
// ----------------------------------------------------------------------------
const birdsGroup = new THREE.Group();
scene.add(birdsGroup);

// Clean, graceful wireframe wing geometry
function createWireframeWingGeometry() {
  const pts = [
    new THREE.Vector3(0.0, 0.0, 0.24),
    new THREE.Vector3(0.88, 0.07, -0.12),
    new THREE.Vector3(0.88, 0.07, -0.12),
    new THREE.Vector3(0.0, 0.0, -0.22),
    new THREE.Vector3(0.0, 0.0, 0.08),
    new THREE.Vector3(0.62, 0.04, -0.16)
  ];
  return new THREE.BufferGeometry().setFromPoints(pts);
}

const wireWingGeo = createWireframeWingGeometry();
const birdFlock = [];
const NUM_BIRDS = 28;

const subtleBirdPalette = [0xbae6fd, 0xfde68a, 0xfecdd3, 0xa7f3d0, 0xddd6fe];

for (let i = 0; i < NUM_BIRDS; i++) {
  const birdRoot = new THREE.Group();
  const birdColor = subtleBirdPalette[i % subtleBirdPalette.length];

  const wingMat = new THREE.LineBasicMaterial({
    color: birdColor,
    transparent: true,
    opacity: 0.62,
    blending: THREE.AdditiveBlending
  });

  const leftWing = new THREE.LineSegments(wireWingGeo, wingMat);
  leftWing.scale.x = -1;
  const rightWing = new THREE.LineSegments(wireWingGeo, wingMat);

  birdRoot.add(leftWing, rightWing);
  birdsGroup.add(birdRoot);

  // Subtle, shorter 3D motion-trail line ribbon behind each bird
  const trailLen = 10;
  const trailPositions = new Float32Array(trailLen * 3);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
  const trailMat = new THREE.LineBasicMaterial({
    color: birdColor,
    transparent: true,
    opacity: 0.20,
    blending: THREE.AdditiveBlending
  });
  const trailLine = new THREE.Line(trailGeo, trailMat);
  birdsGroup.add(trailLine);

  birdFlock.push({
    root: birdRoot,
    leftWing,
    rightWing,
    trailLine,
    trailGeo,
    trailLen,
    mat: wingMat,
    orbitRadius: 5.2 + (i % 7) * 0.72,
    orbitSpeed: 0.36 + (i % 5) * 0.06,
    phaseOffset: (i / NUM_BIRDS) * Math.PI * 2,
    verticalAmp: 1.2 + (i % 5) * 0.42,
    verticalFreq: 0.58 + (i % 4) * 0.16,
    flapSpeed: 9.5 + (i % 4) * 1.4,
    scale: 0.28 + (i % 3) * 0.06
  });
}

// ----------------------------------------------------------------------------
// 4D. 3D CELESTIAL STAR-STREAK VECTOR LINES (Replaces Dots with Pure Lines)
// ----------------------------------------------------------------------------
const starLineCount = 240;
const starLineGeo = new THREE.BufferGeometry();
const starLinePos = new Float32Array(starLineCount * 6);
const starLineCol = new Float32Array(starLineCount * 6);

for (let i = 0; i < starLineCount; i++) {
  const seed = i * 19.731;
  const r = 7.5 + (seed % 18.0);
  const theta = (seed * 1.7) % (Math.PI * 2);
  const phi = Math.acos(2.0 * ((seed * 0.37) % 1.0) - 1.0);

  const x0 = r * Math.sin(phi) * Math.cos(theta);
  const y0 = r * Math.sin(phi) * Math.sin(theta);
  const z0 = r * Math.cos(phi);

  const streakLen = 0.20 + (i % 3) * 0.08;
  const x1 = x0 - Math.sin(theta) * streakLen;
  const y1 = y0 + Math.cos(theta) * streakLen * 0.35;
  const z1 = z0 + Math.cos(phi) * streakLen * 0.5;

  starLinePos.set([x0, y0, z0, x1, y1, z1], i * 6);

  const cChoice = i % 4;
  let cr = 0.73, cg = 0.90, cb = 0.99; // Soft Sky Blue
  if (cChoice === 1) { cr = 0.99; cg = 0.80; cb = 0.83; }      // Soft Rose
  else if (cChoice === 2) { cr = 0.99; cg = 0.90; cb = 0.54; } // Champagne Gold
  else if (cChoice === 3) { cr = 0.65; cg = 0.95; cb = 0.81; } // Soft Mint

  starLineCol.set([cr, cg, cb, cr * 0.15, cg * 0.15, cb * 0.15], i * 6);
}
starLineGeo.setAttribute('position', new THREE.BufferAttribute(starLinePos, 3));
starLineGeo.setAttribute('color', new THREE.BufferAttribute(starLineCol, 3));

const starLineMat = new THREE.LineBasicMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.38,
  blending: THREE.AdditiveBlending
});
const starfieldLines = new THREE.LineSegments(starLineGeo, starLineMat);
scene.add(starfieldLines);

// ============================================================================
// 5. DETERMINISTIC 3D WIREFRAME SCENE EVALUATOR (`update3DWorldAtTime(t)`)
// ============================================================================
function evalBirdPosition(b, idx, timeSec) {
  const angle = timeSec * b.orbitSpeed + b.phaseOffset;
  const r = b.orbitRadius + Math.sin(timeSec * 0.5 + idx) * 0.8;
  const x = Math.cos(angle) * r;
  const z = Math.sin(angle) * r;
  const y = Math.sin(timeSec * b.verticalFreq + b.phaseOffset) * b.verticalAmp + (idx % 2 === 0 ? 0.8 : -0.5);
  return { x, y, z };
}

function update3DWorldAtTime(t) {
  cameraUserYaw += (targetUserYaw - cameraUserYaw) * 0.08;
  cameraUserPitch += (targetUserPitch - cameraUserPitch) * 0.08;

  const emerge3D = smoothstep(17.5, 23.0, t);
  const act4Ascent = smoothstep(29.5, 36.5, t);

  // 1. Update 3D Wireframe Earth Globe & Continental Contours
  const earthScale = mix(0.001, 1.0, smoothstep(17.2, 22.5, t));
  earthGroup.scale.setScalar(earthScale);
  earthGroup.rotation.y = t * 0.34 + cameraUserYaw * 0.5;
  earthGroup.rotation.x = 0.18 * Math.sin(t * 0.25) + cameraUserPitch * 0.4;

  earthLineMaterials.forEach((item) => {
    item.mat.opacity = emerge3D * item.maxAlpha;
  });

  orbitalRing1.rotation.z = t * 0.24;
  orbitalRing2.rotation.y = -t * 0.20;

  // 2. Update Blossoming 3D Wireframe Rose Buds & Lotus Chalices (Petal-by-Petal Unfurling)
  flowerInstances.forEach((f, idx) => {
    const localBloomStart = 20.0 + f.delay * 6.2;
    const bloomProgress = smoothstep(localBloomStart, localBloomStart + 4.6, t);

    if (bloomProgress <= 0.001) {
      f.root.visible = false;
    } else {
      f.root.visible = true;
      const scalePop = f.baseScale * smoothstep(0.0, 0.45, bloomProgress);
      f.root.scale.setScalar(scalePop);

      if (!f.onEarth) {
        f.root.rotation.y = f.basePos[0] * 0.08 + Math.sin(t * 0.6 + idx) * 0.25;
        f.root.position.y = f.basePos[1] + Math.sin(t * 1.1 + idx) * 0.18;
      }

      f.petals.forEach((p) => {
        const layerLag = p.layerIdx * 0.14;
        const pProg = smoothstep(layerLag, 0.85 + layerLag * 0.5, bloomProgress);
        const breath = Math.sin(t * 2.4 + p.petalIdx * 0.5) * 0.045 * pProg;
        p.mesh.rotation.x = mix(p.tiltClosed, p.tiltOpen, pProg) + breath;
      });
    }
  });

  // 2B. Update Growing 3D Wireframe Trees (Oak, Bonsai & Weeping Willows)
  treeInstances.forEach((tr, idx) => {
    const localGrowStart = 19.8 + tr.delay * 5.8;
    const growProgress = smoothstep(localGrowStart, localGrowStart + 4.4, t);

    if (growProgress <= 0.001) {
      tr.root.visible = false;
    } else {
      tr.root.visible = true;
      const s = tr.baseScale * growProgress;
      tr.root.scale.set(s, s * (0.85 + 0.15 * growProgress), s);
      // Gentle wind sway in canopy
      tr.canopyLines.rotation.z = Math.sin(t * 1.6 + idx) * 0.055 * growProgress;
      tr.canopyLines.rotation.x = Math.cos(t * 1.2 + idx) * 0.04 * growProgress;
    }
  });

  // 2C. Update Swirling 3D Wireframe Rose Petals & Falling Leaves in the Wind
  const windProgress = smoothstep(21.5, 27.0, t);
  driftingLeaves.forEach((lf, idx) => {
    if (windProgress <= 0.002) {
      lf.mesh.visible = false;
    } else {
      lf.mesh.visible = true;
      const a = t * lf.speed + lf.phase;
      const r = lf.radius + Math.sin(t * 0.7 + idx) * 0.65;
      lf.mesh.position.set(
        Math.cos(a) * r,
        lf.yBase + Math.sin(t * 0.9 + idx) * 1.8,
        Math.sin(a) * r
      );
      lf.mesh.rotation.set(t * lf.spinSpeed, a, Math.sin(t + idx));
      lf.mesh.scale.setScalar(windProgress * 1.15);
    }
  });

  // 3. Update Soaring 3D Wireframe Bird Flock & Glowing Flight Ribbons
  const flockProgress = smoothstep(24.0, 30.5, t);
  birdFlock.forEach((b, idx) => {
    if (flockProgress <= 0.002) {
      b.root.visible = false;
      b.trailLine.visible = false;
    } else {
      b.root.visible = true;
      b.trailLine.visible = true;
      b.root.scale.setScalar(b.scale * smoothstep(0.0, 0.35, flockProgress));

      const curr = evalBirdPosition(b, idx, t);
      const next = evalBirdPosition(b, idx, t + 0.05);

      b.root.position.set(curr.x, curr.y, curr.z);
      b.root.lookAt(next.x, next.y, next.z);

      // Articulated flapping wireframe wings
      const flapAngle = Math.sin(t * b.flapSpeed + b.phaseOffset) * 0.72;
      b.leftWing.rotation.z = -flapAngle;
      b.rightWing.rotation.z = flapAngle;

      // Update trailing 3D vector ribbon
      const posAttr = b.trailGeo.attributes.position;
      for (let s = 0; s < b.trailLen; s++) {
        const histT = t - s * 0.032;
        const pt = evalBirdPosition(b, idx, histT);
        posAttr.setXYZ(s, pt.x, pt.y, pt.z);
      }
      posAttr.needsUpdate = true;
    }
  });

  // 4. Star-Streak Vector Field Rotation
  starfieldLines.rotation.y = t * 0.04;
  starfieldLines.rotation.x = Math.sin(t * 0.10) * 0.06;
  starLineMat.opacity = mix(0.18, 0.42, emerge3D);

  // 5. Sweeping Cinematic 3D Camera Choreography
  const camZ = mix(19.5, 14.2, smoothstep(19.5, 28.0, t)) + act4Ascent * 2.0;
  const camX = Math.sin(t * 0.20) * 2.6 * emerge3D + cameraUserYaw * 5.0;
  const camY = mix(0.6, 1.4, act4Ascent) + Math.cos(t * 0.15) * 0.85 * emerge3D + cameraUserPitch * 4.0;

  camera.position.set(camX, camY, camZ);
  camera.lookAt(0, mix(0.0, -0.25, emerge3D), 0);

  renderer.render(scene, camera);
}

// ============================================================================
// 6. 2D FOURIER EPICYCLE GEAR & MULTI-LAYER NEON LINE-ART RENDERER (Zero Fills)
// ============================================================================
const themes = {
  earth: {
    coreStroke: '#7dd3fc',       // Soft Celestial Sky Blue
    outerGlow: '#38bdf8',
    hotCore: '#f0f9ff',
    gearRingMajor: 'rgba(125, 211, 252, 0.30)',
    gearRingMinor: 'rgba(196, 181, 253, 0.14)',
    gearTick: 'rgba(125, 211, 252, 0.36)',
    gearArmMajor: 'rgba(224, 242, 254, 0.72)',
    gearArm: 'rgba(125, 211, 252, 0.38)',
    pivots: '#f0f9ff'
  },
  oak: {
    coreStroke: '#6ee7b7',       // Soft Sage-Emerald Oak
    outerGlow: '#34d399',
    hotCore: '#ecfdf5',
    gearRingMajor: 'rgba(110, 231, 183, 0.30)',
    gearRingMinor: 'rgba(253, 230, 138, 0.14)',
    gearTick: 'rgba(167, 243, 208, 0.36)',
    gearArmMajor: 'rgba(209, 250, 229, 0.72)',
    gearArm: 'rgba(110, 231, 183, 0.38)',
    pivots: '#ecfdf5'
  },
  rose: {
    coreStroke: '#fda4af',       // Delicate Dusty Rose
    outerGlow: '#fb7185',
    hotCore: '#fff1f2',
    gearRingMajor: 'rgba(253, 164, 175, 0.32)',
    gearRingMinor: 'rgba(253, 230, 138, 0.14)',
    gearTick: 'rgba(254, 205, 211, 0.36)',
    gearArmMajor: 'rgba(255, 228, 230, 0.72)',
    gearArm: 'rgba(253, 164, 175, 0.40)',
    pivots: '#fff1f2'
  },
  willow: {
    coreStroke: '#c4b5fd',       // Soft Lavender-Orchid Willow & Fern
    outerGlow: '#a78bfa',
    hotCore: '#f5f3ff',
    gearRingMajor: 'rgba(196, 181, 253, 0.30)',
    gearRingMinor: 'rgba(125, 211, 252, 0.14)',
    gearTick: 'rgba(221, 214, 254, 0.36)',
    gearArmMajor: 'rgba(237, 233, 254, 0.72)',
    gearArm: 'rgba(196, 181, 253, 0.38)',
    pivots: '#f5f3ff'
  },
  wildlife: {
    coreStroke: '#fde68a',       // Warm Champagne Gold
    outerGlow: '#fbbf24',
    hotCore: '#fffbeb',
    gearRingMajor: 'rgba(253, 230, 138, 0.30)',
    gearRingMinor: 'rgba(253, 164, 175, 0.14)',
    gearTick: 'rgba(254, 243, 199, 0.36)',
    gearArmMajor: 'rgba(254, 243, 199, 0.72)',
    gearArm: 'rgba(253, 230, 138, 0.38)',
    pivots: '#fffbeb'
  },
  bird: {
    coreStroke: '#bae6fd',       // Pearl Ice Blue Avian Crown
    outerGlow: '#7dd3fc',
    hotCore: '#f0f9ff',
    gearRingMajor: 'rgba(186, 230, 253, 0.30)',
    gearRingMinor: 'rgba(110, 231, 183, 0.14)',
    gearTick: 'rgba(224, 242, 254, 0.36)',
    gearArmMajor: 'rgba(240, 249, 255, 0.72)',
    gearArm: 'rgba(186, 230, 253, 0.38)',
    pivots: '#f0f9ff'
  }
};

function drawEpicycleMechanism(cx, cy, terms, penPhi, theme, gearOpacity = 1.0) {
  if (gearOpacity <= 0.01) return null;

  let x = cx;
  let y = cy;
  let drawnRank = 0;

  ctx.save();
  ctx.globalAlpha = gearOpacity;
  ctx.globalCompositeOperation = 'lighter';

  for (let i = 0; i < terms.length; i++) {
    const prevX = x;
    const prevY = y;
    const { freq, amp, phase } = terms[i];
    const angle = freq * penPhi + phase;

    x += amp * Math.cos(angle);
    y += amp * Math.sin(angle);

    if (freq === 0) {
      ctx.strokeStyle = theme.gearArm;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 8, y); ctx.lineTo(x + 8, y);
      ctx.moveTo(x, y - 8); ctx.lineTo(x, y + 8);
      ctx.stroke();
      continue;
    }

    if (amp > 1.0 && drawnRank < 48) {
      const isTop5 = drawnRank < 5;

      // 1. Epicycle Frequency Circle
      ctx.beginPath();
      ctx.arc(prevX, prevY, amp, 0, Math.PI * 2);
      ctx.strokeStyle = isTop5 ? theme.gearRingMajor : theme.gearRingMinor;
      ctx.lineWidth = isTop5 ? 1.5 : 0.9;
      ctx.stroke();

      // 2. Protractor Degree Ticks on Top 5 Harmonic Rings
      if (isTop5 && amp > 15) {
        const tickCount = 24;
        ctx.beginPath();
        for (let k = 0; k < tickCount; k++) {
          const tickAngle = angle + (k / tickCount) * Math.PI * 2;
          const tickLen = k % 6 === 0 ? 6.0 : 3.0;
          const rInner = Math.max(0, amp - tickLen);
          ctx.moveTo(prevX + Math.cos(tickAngle) * rInner, prevY + Math.sin(tickAngle) * rInner);
          ctx.lineTo(prevX + Math.cos(tickAngle) * amp, prevY + Math.sin(tickAngle) * amp);
        }
        ctx.strokeStyle = theme.gearTick;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }

      // 3. Vector Radius Arm
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = isTop5 ? theme.gearArmMajor : theme.gearArm;
      ctx.lineWidth = isTop5 ? 1.75 : 1.1;
      ctx.stroke();

      // 4. Hollow Vector Pivot Ring (Pure Line Art — No Solid Dot Fill)
      if (drawnRank < 14) {
        ctx.beginPath();
        ctx.arc(prevX, prevY, isTop5 ? 3.2 : 2.0, 0, Math.PI * 2);
        ctx.strokeStyle = theme.pivots;
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }
      drawnRank++;
    }
  }

  // Intense Laser Pen Nib Ring & Crosshair Flare (Pure Line Art)
  ctx.shadowColor = theme.coreStroke;
  ctx.shadowBlur = 28;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.0;

  ctx.beginPath();
  ctx.arc(x, y, 4.5, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, 10.5, 0, Math.PI * 2);
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Anamorphic Laser Crosshair Streak at Pen Tip
  ctx.beginPath();
  ctx.moveTo(x - 18, y); ctx.lineTo(x + 18, y);
  ctx.moveTo(x, y - 18); ctx.lineTo(x, y + 18);
  ctx.strokeStyle = theme.coreStroke;
  ctx.lineWidth = 1.1;
  ctx.stroke();

  ctx.restore();
  return { x, y };
}

function renderProgressiveFourierDrawing(cx, cy, terms, progress, theme, harmonicEchoAlpha, masterAlpha = 1.0, gearAlpha = 1.0) {
  if (masterAlpha <= 0.005) return;

  const clampedProg = Math.max(0.0, Math.min(1.0, progress));
  const totalSteps = 480;
  const activeSteps = Math.floor(clampedProg * totalSteps);
  const penPhi = clampedProg * Math.PI * 2;

  ctx.save();
  ctx.globalAlpha = masterAlpha;
  ctx.globalCompositeOperation = 'lighter';

  // 1. Inner Concentric Harmonic Echo Line Rings (Replaces solid polygon fill with pure glowing lines!)
  if (harmonicEchoAlpha > 0.005) {
    [0.92, 0.84, 0.76].forEach((scaleFactor, idx) => {
      ctx.save();
      ctx.beginPath();
      for (let s = 0; s <= totalSteps; s += 2) {
        const phi = (s / totalSteps) * Math.PI * 2;
        const pt = evaluateFourierPoint(0, 0, terms, phi);
        // Scale around shape's own DC centroid
        const dcX = terms[0] && terms[0].freq === 0 ? terms[0].re : 0;
        const dcY = terms[0] && terms[0].freq === 0 ? terms[0].im : 0;
        const sx = cx + dcX + (pt.x - dcX) * scaleFactor;
        const sy = cy + dcY + (pt.y - dcY) * scaleFactor;
        if (s === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.strokeStyle = theme.coreStroke;
      ctx.lineWidth = 1.1 - idx * 0.25;
      ctx.globalAlpha = harmonicEchoAlpha * masterAlpha * (0.42 - idx * 0.11);
      ctx.shadowColor = theme.outerGlow;
      ctx.shadowBlur = 16;
      ctx.stroke();
      ctx.restore();
    });
  }

  // 2. Triple-Pass Neon Laser Line Art Trail (Outer Halo -> Saturated Core -> White-Hot Center)
  if (activeSteps >= 1) {
    const pathPts = [];
    for (let s = 0; s <= activeSteps; s++) {
      const phi = (s / totalSteps) * Math.PI * 2;
      pathPts.push(evaluateFourierPoint(cx, cy, terms, phi));
    }

    // Pass A: Soft Atmospheric Halo Stroke
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < pathPts.length; i++) {
      if (i === 0) ctx.moveTo(pathPts[i].x, pathPts[i].y);
      else ctx.lineTo(pathPts[i].x, pathPts[i].y);
    }
    ctx.strokeStyle = theme.outerGlow;
    ctx.lineWidth = 5.0;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.18 * masterAlpha;
    ctx.shadowColor = theme.outerGlow;
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.restore();

    // Pass B: Crisp Refined Core Line
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < pathPts.length; i++) {
      if (i === 0) ctx.moveTo(pathPts[i].x, pathPts[i].y);
      else ctx.lineTo(pathPts[i].x, pathPts[i].y);
    }
    ctx.strokeStyle = theme.coreStroke;
    ctx.lineWidth = 2.1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = theme.coreStroke;
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();

    // Pass C: Ultra-Thin White-Hot Inner Filament
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < pathPts.length; i++) {
      if (i === 0) ctx.moveTo(pathPts[i].x, pathPts[i].y);
      else ctx.lineTo(pathPts[i].x, pathPts[i].y);
    }
    ctx.strokeStyle = theme.hotCore;
    ctx.lineWidth = 1.0;
    ctx.globalAlpha = 0.85 * masterAlpha;
    ctx.stroke();
    ctx.restore();

    // Hot white-gold leading comet head behind the pen nib
    if (clampedProg < 0.998 && pathPts.length > 2) {
      const hotStart = Math.max(0, pathPts.length - 20);
      ctx.save();
      ctx.beginPath();
      for (let i = hotStart; i < pathPts.length; i++) {
        if (i === hotStart) ctx.moveTo(pathPts[i].x, pathPts[i].y);
        else ctx.lineTo(pathPts[i].x, pathPts[i].y);
      }
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4.2;
      ctx.lineCap = 'round';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 24;
      ctx.stroke();
      ctx.restore();
    }
  }

  // 3. Rotating Epicycle Mechanism
  drawEpicycleMechanism(cx, cy, terms, penPhi, theme, gearAlpha * masterAlpha);
  ctx.restore();
}

// ============================================================================
// 7. CELESTIAL ASTROLABE STAGE, CALLIGRAPHIC LABELS & BAKED CINEMA CAPTIONS
// ============================================================================
function draw2DCelestialBackdrop(t, cx, cy, gridAlpha) {
  if (gridAlpha <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = gridAlpha;

  // Deep-Space Vector Coordinate Grid
  ctx.strokeStyle = 'rgba(0, 245, 255, 0.055)';
  ctx.lineWidth = 1;
  const step = 60;
  for (let x = cx % step; x < W; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = cy % step; y < H; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Glowing Astrolabe Concentric Vector Rings + Latitude/Longitude Blueprint Curves
  [225, 380, 540, 720].forEach((r, idx) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = idx % 2 === 0 ? 'rgba(0, 245, 255, 0.14)' : 'rgba(255, 0, 127, 0.11)';
    ctx.lineWidth = 1.1;
    ctx.stroke();
  });

  // Inner Blueprint Meridian & Parallel Ellipses inside the Earth Circle
  const earthR = 225;
  ctx.strokeStyle = 'rgba(0, 245, 255, 0.16)';
  ctx.lineWidth = 1;
  [0.32, 0.65, 0.92].forEach((ratio) => {
    ctx.beginPath();
    ctx.ellipse(cx, cy, earthR * ratio, earthR, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx, cy, earthR, earthR * ratio, 0, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.restore();
}

// ============================================================================
// 7. CELESTIAL ASTROLABE STAGE, CALLIGRAPHIC LABELS & BAKED CINEMA CAPTIONS
// ============================================================================
function draw2DCelestialBackdrop(t, cx, cy, gridAlpha) {
  if (gridAlpha <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = gridAlpha;

  // Cartesian Coordinate Grid
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.045)';
  ctx.lineWidth = 1;
  const step = 60;
  for (let x = cx % step; x < W; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = cy % step; y < H; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Astrolabe Concentric Rings
  [230, 380, 540, 720].forEach((r, idx) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = idx % 2 === 0 ? 'rgba(56, 189, 248, 0.06)' : 'rgba(251, 191, 36, 0.05)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
  ctx.restore();
}

function drawBlueprintLabel(){}

// ============================================================================
// 8. MASTER DETERMINISTIC COMPOSITE RENDERER (`renderAtTime(t)`)
// ============================================================================
const captionEls = [];

function renderAtTime(t) {
  const clampedT = ((t % DURATION) + DURATION) % DURATION;

  if (progressHairline) {
    progressHairline.style.width = `${(clampedT / DURATION) * 100}%`;
  }
  for (let i = 0; i < captionEls.length; i++) {
    if (captionEls[i]) captionEls[i].style.opacity = '0';
  }

  // 1. Pitch-Black Cosmic Void Background
  const bgGrad = ctx.createRadialGradient(W * 0.5, H * 0.52, 40, W * 0.5, H * 0.52, 1180);
  bgGrad.addColorStop(0, '#090d24');
  bgGrad.addColorStop(0.5, '#040612');
  bgGrad.addColorStop(1, '#010206');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  const cx = W * 0.65;
  const cy = H * 0.5 + 26;

  // 2. Update & Composite the Pure 3D Wireframe World with Dual-Pass Neon Glow!
  update3DWorldAtTime(clampedT);
  if (clampedT >= 17.0) {
    const webglAlpha = smoothstep(17.0, 21.8, clampedT);

    // Pass 1: Subtle Atmospheric Bloom Pass of the 3D Wireframe Canvas
    ctx.save();
    ctx.globalAlpha = webglAlpha * 0.36;
    ctx.globalCompositeOperation = 'lighter';
    ctx.filter = 'blur(7px) brightness(1.18)';
    ctx.drawImage(webglCanvas, W * 0.15, 0, W, H);
    ctx.restore();

    // Pass 2: Crisp, Balanced 3D Vector Lines
    ctx.save();
    ctx.globalAlpha = webglAlpha * 0.88;
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(webglCanvas, W * 0.15, 0, W, H);
    ctx.restore();
  }

  // 3. Render 2D Fourier Epicycle Blueprints (Primary in Acts I & II, smoothly dissolving into 3D Wireframe in Act III)
  const blueprintFadeOut = 1.0 - smoothstep(18.5, 22.2, clampedT);
  draw2DCelestialBackdrop(clampedT, cx, cy, blueprintFadeOut);

  if (blueprintFadeOut > 0.01) {
    // ACT I (0s -> 10s): Primordial Earth Globe traced from 0% -> 100%
    const earthProg = Math.min(1.0, clampedT / 9.2);
    const earthSoul = smoothstep(8.2, 9.5, clampedT);
    const earthGearAlpha = clampedT < 10.0 ? 1.0 : mix(0.65, 0.15, smoothstep(10.0, 22.0, clampedT));

    // In Act II+, let the Earth epicycle pen continue a slow ceremonial orbit
    const activeEarthProg = clampedT < 9.5 ? earthProg : (((clampedT - 9.5) % 8.0) / 8.0);
    if (clampedT < 9.5) {
      renderProgressiveFourierDrawing(cx, cy, earthTerms, earthProg, themes.earth, earthSoul, blueprintFadeOut, 1.0);
    } else {
      // Keep full Earth silhouette glowing while gears slowly revolve
      renderProgressiveFourierDrawing(cx, cy, earthTerms, 1.0, themes.earth, 1.0, blueprintFadeOut * 0.85, 0.0);
      drawEpicycleMechanism(cx, cy, earthTerms, activeEarthProg * Math.PI * 2, themes.earth, earthGearAlpha * blueprintFadeOut);
    }

    drawBlueprintLabel(
      cx, cy + 265,
      'Terra Primordia',
      'PLANETARY DFT // 140 HARMONICS',
      '#7dd3fc',
      smoothstep(6.5, 9.0, clampedT) * blueprintFadeOut
    );

    // ACT II (10s -> 20s): Diverse Botanical & Wildlife Ecosystem (Oak Tree, Rose Bud, Willow/Fern, Stag, Bird)
    if (clampedT >= 10.0) {
      const natureProg = Math.min(1.0, (clampedT - 10.2) / 8.6);
      const natureSoul = smoothstep(17.5, 19.2, clampedT);
      const birdTerms = staticBirdTerms;

      renderProgressiveFourierDrawing(cx, cy, oakTreeTerms, natureProg, themes.oak, natureSoul, blueprintFadeOut, 0.82);
      renderProgressiveFourierDrawing(cx, cy, roseBudTerms, natureProg, themes.rose, natureSoul, blueprintFadeOut, 0.82);
      renderProgressiveFourierDrawing(cx, cy, willowFernTerms, natureProg, themes.willow, natureSoul, blueprintFadeOut, 0.82);
      renderProgressiveFourierDrawing(cx, cy, stagTerms, natureProg, themes.wildlife, natureSoul, blueprintFadeOut, 0.82);
      renderProgressiveFourierDrawing(cx, cy, birdTerms, natureProg, themes.bird, natureSoul, blueprintFadeOut, 0.82);

      const lblAlpha = smoothstep(15.2, 18.2, clampedT) * blueprintFadeOut;
      drawBlueprintLabel(cx - 615, cy + 255, 'Quercus Robur', 'ANCIENT OAK & ROOTS // DFT I', '#6ee7b7', lblAlpha);
      drawBlueprintLabel(cx - 335, cy + 35, 'Rosa Damascena', 'SPIRAL ROSE BUD // DFT II', '#fda4af', lblAlpha);
      drawBlueprintLabel(cx + 335, cy + 35, 'Salix & Filices', 'WILLOW & FERN FROND // DFT III', '#c4b5fd', lblAlpha);
      drawBlueprintLabel(cx + 615, cy + 255, 'Cervus Elaphus', 'FOREST STAG // DFT IV', '#fde68a', lblAlpha);
      drawBlueprintLabel(cx, cy - 115, 'Avis Coelestis', 'MIGRATING FLOCK // DFT V', '#bae6fd', lblAlpha);
    }
  }

  // 4. Baked-in Cinema Typography & Telemetry HUD

}

// ============================================================================

const fourierCache = new WeakMap();
function evaluateFourierPoint(cx,cy,terms,phi){
 let cache=fourierCache.get(terms);if(!cache){cache=new Map();fourierCache.set(terms,cache);}
 let p=cache.get(phi);if(!p){p=rawFourierPoint(0,0,terms,phi);cache.set(phi,p);}
 return {x:cx+p.x,y:cy+p.y};
}
const staticBirdTerms=buildSoaringBirdDFT(0);

 let time=22,running=false,last=0,raf=0,lastReport=0;
 function report(){onChange?.({time,running,duration:DURATION});}
 function draw(){renderAtTime(time);}
 function tick(now){if(!running)return;raf=requestAnimationFrame(tick);if(now-last<1000/30)return;const dt=last?Math.min(.1,(now-last)/1000):0;last=now;time=(time+dt)%DURATION;draw();if(now-lastReport>200){report();lastReport=now;}}
 const api={mode:renderMode,play(){if(running)return;running=true;last=0;raf=requestAnimationFrame(tick);report();},pause(){running=false;cancelAnimationFrame(raf);last=0;report();},seek(t){time=Math.max(0,Math.min(39.999,Number(t)||0));last=0;draw();report();},get time(){return time;},get running(){return running;}};
 stageCanvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const b=stageCanvas.getBoundingClientRect();targetUserYaw=((e.clientX-b.left)/b.width-.5)*.6;targetUserPitch=((e.clientY-b.top)/b.height-.5)*.35;if(!running)draw();});
 stageCanvas.addEventListener('pointerleave',()=>{targetUserYaw=0;targetUserPitch=0;});
 webglCanvas.addEventListener('webglcontextlost',e=>{e.preventDefault();api.pause();onChange?.({failed:true});});
 draw();report();return api;
}};
