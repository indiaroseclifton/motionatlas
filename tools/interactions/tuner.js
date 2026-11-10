/* Settings come from the JSON block above. Change a value there, or call apply() after changing S. */
const S=JSON.parse(document.getElementById('settings').textContent),calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const theme=()=>{const r=document.documentElement;r.dataset.mode=S.mode||'dark';if(S.accent)r.style.setProperty('--ac',S.accent)};
addEventListener('message',e=>{const d=e.data;if(d&&d.atlasSet){Object.assign(S,d.atlasSet);apply()}});
if(parent!==window)parent.postMessage({atlasControls:CONTROLS,atlasValues:S},'*');
