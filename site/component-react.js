'use strict';
/* React export for the component lab (component-lab.js).
   Each of the 64 components becomes one self-contained .jsx module:
     - the markup of every real variant as JSX (DOM-parsed, not regex-converted), ids scoped with useId
     - the component CSS plus light and dark theme tokens, injected once (also exported as `css`)
     - the exact behaviour the atlas runs in its live demo, mounted in useEffect on a ref and torn
       down on unmount (every listener it adds is bound to an AbortController signal, so React
       StrictMode's double mount does not double-bind)
     - state mirrored into useState from the DOM's ARIA attributes and reported through onStateChange
   ComponentReact.code(c) returns the module text; .zip() bundles all 64 with an index.js barrel. */
(()=>{
 const STATE_ONLY=new Set(['hover','focus','active','drag','lifted','dropped']);
 const VOID=new Set(['area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr']);
 const ATTR={class:'className',for:'htmlFor',tabindex:'tabIndex',readonly:'readOnly',maxlength:'maxLength',minlength:'minLength',autocomplete:'autoComplete',autofocus:'autoFocus',spellcheck:'spellCheck',contenteditable:'contentEditable',colspan:'colSpan',rowspan:'rowSpan',inputmode:'inputMode',enterkeyhint:'enterKeyHint',novalidate:'noValidate',datetime:'dateTime',crossorigin:'crossOrigin',accesskey:'accessKey',srcset:'srcSet',allowfullscreen:'allowFullScreen',playsinline:'playsInline',autoplay:'autoPlay',formnovalidate:'formNoValidate',usemap:'useMap','xlink:href':'xlinkHref','xml:space':'xmlSpace'};
 const BOOL=new Set(['hidden','disabled','required','multiple','autofocus','novalidate','open','readonly','formnovalidate','allowfullscreen','playsinline','autoplay','muted','loop','controls','reversed','default']);
 const IDREF=new Set(['id','for','aria-labelledby','aria-describedby','aria-controls','aria-activedescendant','aria-owns','aria-details','aria-errormessage','aria-flowto','headers','list']);
 const pascal=s=>s.replace(/[^A-Za-z0-9]+(.)?/g,(_,c)=>c?c.toUpperCase():'').replace(/^./,c=>c.toUpperCase());
 const q=v=>/[&"\\\n{}]/.test(v)?`{${JSON.stringify(v)}}`:`"${v}"`;
 const textOK=t=>/^[^\s{}<>&](?:[^{}<>&\n]*[^\s{}<>&])?$/.test(t);

 /* ---------- HTML → JSX ---------- */
 function jsx(html,ind='      '){
  const tpl=document.createElement('template');tpl.innerHTML=html;
  const ids=new Set([...tpl.content.querySelectorAll('[id]')].map(e=>e.id));
  const scoped=v=>{const toks=v.trim().split(/\s+/);return toks.length&&toks.every(t=>ids.has(t))?'{`'+toks.map(t=>'${uid}-'+t).join(' ')+'`}':null;};
  function attrs(el){
   const tag=el.localName,svg=el.namespaceURI==='http://www.w3.org/2000/svg',out=[];
   let selDefault=null;
   if(tag==='select'){const o=[...el.options].find(o=>o.hasAttribute('selected'));if(o)selDefault=o.value;}
   for(const {name,value} of [...el.attributes]){
    if(/^on/i.test(name))continue;
    if(name==='class'){const v=value.replace(/\s+/g,' ').trim();if(v)out.push(`className=${q(v)}`);continue;}
    if(tag==='option'&&name==='selected')continue;
    if(name==='style'){const decl=value.split(';').map(d=>d.trim()).filter(Boolean).map(d=>{const i=d.indexOf(':');const k=d.slice(0,i).trim(),v=d.slice(i+1).trim();return `${k.startsWith('--')?JSON.stringify(k):/^[a-z-]+$/.test(k)?k.replace(/-([a-z])/g,(_,c)=>c.toUpperCase()).replace(/^Webkit/,'Webkit'):JSON.stringify(k)}: ${JSON.stringify(v)}`;});if(decl.length)out.push(`style={{ ${decl.join(', ')} }}`);continue;}
    if(IDREF.has(name)){const s=scoped(value);if(s){out.push(`${ATTR[name]||name}=${s}`);continue;}}
    if(name==='href'&&value.startsWith('#')&&ids.has(value.slice(1))){out.push('href={`#${uid}-'+value.slice(1)+'`}');continue;}
    if(name==='name'&&tag==='input'&&/radio/i.test(el.getAttribute('type')||'')){out.push('name={`${uid}-'+value+'`}');continue;}
    if(name==='value'&&(tag==='textarea'||(tag==='input'&&!/^(checkbox|radio|button|submit|reset)$/i.test(el.getAttribute('type')||'')))){out.push(`defaultValue=${q(value)}`);continue;}
    if(name==='checked'&&tag==='input'){out.push('defaultChecked');continue;}
    if(name==='tabindex'&&/^-?\d+$/.test(value)){out.push(`tabIndex={${value}}`);continue;}
    let n=ATTR[name]||name;
    if(!ATTR[name]&&name.includes('-')&&!/^(aria|data)-/.test(name))n=name.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
    if(BOOL.has(name)&&!svg){out.push(n);continue;}
    if(name==='inert'){out.push('inert=""');continue;}
    out.push(`${n}=${q(value)}`);
   }
   if(selDefault!=null)out.push(`defaultValue=${q(selDefault)}`);
   if(el.hasAttribute('contenteditable'))out.push('suppressContentEditableWarning');
   if(tag==='textarea'&&el.textContent)out.push(`defaultValue=${q(el.textContent)}`);
   return out.length?' '+out.join(' '):'';
  }
  function node(n,pad){
   if(n.nodeType===3){const t=n.textContent;if(!t)return '';return pad+(textOK(t)?t:`{${JSON.stringify(t)}}`);}
   if(n.nodeType!==1)return '';
   const tag=n.localName,a=attrs(n);
   const kids=tag==='textarea'?[]:[...n.childNodes].filter(k=>k.nodeType===1||(k.nodeType===3&&k.textContent));
   if(!kids.length)return `${pad}<${tag}${a}${VOID.has(tag)||!kids.length?' />':`></${tag}>`}`;
   if(kids.length===1&&kids[0].nodeType===3){const one=`${pad}<${tag}${a}>${textOK(kids[0].textContent)?kids[0].textContent:`{${JSON.stringify(kids[0].textContent)}}`}</${tag}>`;if(one.length<=118)return one;}
   return `${pad}<${tag}${a}>\n${kids.map(k=>node(k,pad+'  ')).filter(Boolean).join('\n')}\n${pad}</${tag}>`;
  }
  const top=[...tpl.content.childNodes].filter(k=>k.nodeType===1||(k.nodeType===3&&k.textContent.trim()));
  if(top.length===1&&top[0].nodeType===1)return node(top[0],ind);
  return `${ind}<>\n${top.map(k=>node(k,ind+'  ')).join('\n')}\n${ind}</>`;
 }

 /* ---------- runtime: only the helpers this behaviour reaches ---------- */
 function runtimeFor(src){
  const RT=ComponentLab.runtime,names=Object.keys(RT),need=new Set();let uid=false;
  const scan=s=>{if(/\bUID\b/.test(s))uid=true;for(const n of names)if(!need.has(n)&&new RegExp('(^|[^\\w$.])'+n.replace(/\$/g,'\\$')+'\\b').test(s)){need.add(n);scan(srcOf(n));}};
  const srcOf=n=>{const v=RT[n];return typeof v==='function'?v.toString():JSON.stringify(v);};
  scan(src);
  const lines=[];if(uid)lines.push('let UID = 0;');
  for(const n of names){if(!need.has(n))continue;const v=RT[n];
   if(typeof v==='function'){const s=v.toString();lines.push(/^function\b/.test(s)?s:`const ${n} = ${s};`);}
   else lines.push(`const ${n} = ${JSON.stringify(v)};`);}
  return lines.join('\n');
 }
 function behaviourSrc(fn){
  const s=fn.toString();
  if(/^(async\s+)?function\b/.test(s)||/^(async\s*)?(\([^)]*\)|[\w$]+)\s*=>/.test(s))return `const behaviour = ${s};`;
  const m=/^(async\s+)?([\w$]+)\s*\(/.exec(s);return `const behaviour = ({ ${s} })[${JSON.stringify(m?m[2]:'live')}];`;
 }

 /* ---------- CSS ---------- */
 function fontImport(t){
  if(t.shape.system)return '';
  const fams=[...new Set([t.fonts.display,t.fonts.body])];
  return `@import url('https://fonts.googleapis.com/css2?${fams.map(f=>'family='+encodeURIComponent(f).replace(/%20/g,'+')+(/VT323|Caveat|Bebas|Archivo Black|DM Serif|IM Fell/.test(f)?'':':wght@400;500;600;700')).join('&')}&display=swap');\n`;
 }
 function cssFor(c,o){
  const t=AtlasThemes.byId[o.theme]||AtlasThemes.list[0];
  const block=(sel,mode)=>`${sel}{\n${Object.entries(AtlasThemes.vars(t,mode,o.density)).map(([k,v])=>`  ${k}: ${v};`).join('\n')}\n}`;
  return `${fontImport(t)}/* ${t.id} ${t.name} tokens (${o.density}) */\n${block('.cl-root','light')}\n${block('.cl-root[data-mode="dark"]','dark')}\n.cl-root{background:var(--cl-bg);padding:16px;border-radius:12px}\n${ComponentLab.base}\n${c.css}`.replace(/\\/g,'\\\\').replace(/`/g,'\\`').replace(/\$\{/g,'\\${');
 }

 /* ---------- module ---------- */
 const opts=o=>{const S=ComponentLab.state||{};return {theme:o?.theme||S.theme||'S05',mode:o?.mode||S.mode||'light',density:o?.density||S.density||'comfortable',label:o?.label??S.label??'',icon:o?.icon??S.icon??false};};
 function variantsOf(c){const def=c.liveV||c.v[0][0];const vs=c.v.filter(([k])=>!STATE_ONLY.has(k)||k===def);vs.sort((a,b)=>(b[0]===def)-(a[0]===def));return vs;}
 function code(c,o){
  o=opts(o);const name=pascal(c.name),vs=variantsOf(c),def=vs[0][0],t=AtlasThemes.byId[o.theme]||AtlasThemes.list[0];
  const markup=vs.map(([k,l])=>`    case ${JSON.stringify(k)}: // ${l}\n      return (\n${jsx(c.html(k,{label:o.label,icon:o.icon,uid:c.id.toLowerCase()}),'        ')}\n      );`).join('\n');
  const beh=c.live?behaviourSrc(c.live):'const behaviour = () => {};';
  const rt=c.live?runtimeFor(c.live.toString()):'';
  return `/* ${c.id} · ${c.name}
   Exported from the Visual & Motion Atlas component lab · theme ${t.id} ${t.name} · ${o.density}.
   Self-contained: React 18+, no other dependencies.

   <${name} variant=${JSON.stringify(def)} mode="light" onStateChange={(s) => console.log(s)} />

   Props
     variant        ${vs.map(v=>JSON.stringify(v[0])).join(' | ')}
     mode           "light" | "dark"
     onStateChange  called with { checked, pressed, expanded, selected, current, valuenow, invalid, values, shown, actions, status }
                    whenever the component's ARIA state changes
     ...rest        passed to the wrapping <div class="cl-root">

   Keyboard: ${c.a11y.keys.join(' · ')}
   Role: ${c.a11y.role}
   The behaviour below is the same code the atlas runs in its live demo. It is mounted on a ref in
   useEffect; every listener is tied to an AbortController and the DOM changes it makes while setting
   up are undone on cleanup, so unmounting and React StrictMode's double mount leave nothing behind.
   Changing \`variant\` remounts the markup. */
import React, { memo, useEffect, useId, useRef, useState } from 'react';

export const css = \`${cssFor(c,o)}\`;

export const variants = ${JSON.stringify(Object.fromEntries(vs.map(([k,l])=>[k,l])))};

/* ---------- behaviour (from the atlas live demo) ---------- */
${rt}
${beh}

/* ---------- plumbing ---------- */
const STYLE_ID = ${JSON.stringify(`atlas-${c.id.toLowerCase()}-${t.id.toLowerCase()}`)};
const useInsertion = React.useInsertionEffect || React.useLayoutEffect;
function useAtlasStyles() {
  useInsertion(() => {
    if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = css;
    document.head.appendChild(el);
  }, []);
}
// Ties every listener the behaviour adds while it sets up to one AbortSignal.
function withSignal(signal, run) {
  const proto = EventTarget.prototype;
  const add = proto.addEventListener;
  proto.addEventListener = function (type, fn, options) {
    const o = typeof options === 'object' && options !== null ? { ...options } : { capture: !!options };
    if (!o.signal) o.signal = signal;
    return add.call(this, type, fn, o);
  };
  try { run(); } catch (err) { console.warn('[${name}] behaviour failed', err); } finally { proto.addEventListener = add; }
}
const STATE_ATTRS = ['aria-checked', 'aria-pressed', 'aria-expanded', 'aria-selected', 'aria-current', 'aria-valuenow', 'aria-invalid', 'aria-sort', 'aria-busy'];
const labelOf = (el) => el.getAttribute('aria-label') || (el.labels && el.labels[0] && el.labels[0].textContent.trim()) || el.textContent.trim().slice(0, 60);
function readState(root) {
  const out = {};
  for (const a of STATE_ATTRS) {
    const els = root.querySelectorAll('[' + a + ']');
    if (els.length) out[a.slice(5)] = Array.from(els, (el) => [labelOf(el), el.getAttribute(a)]);
  }
  const fields = root.querySelectorAll('input, textarea, select');
  if (fields.length) out.values = Array.from(fields, (el) => [labelOf(el), el.type === 'checkbox' || el.type === 'radio' ? el.checked : el.value]);
  const named = root.querySelectorAll('button[aria-label]');
  if (named.length) out.actions = Array.from(named, (el) => el.getAttribute('aria-label'));
  const shown = root.querySelectorAll('[role="dialog"], [role="tooltip"], [role="menu"], [role="listbox"], [role="alert"], [role="status"], [role="region"]');
  if (shown.length) out.shown = Array.from(shown, (el) => [el.getAttribute('aria-label') || el.getAttribute('role'), !el.closest('[hidden]')]);
  const live = root.querySelectorAll('[data-note], [role="status"], [role="alert"], [aria-live]');
  const text = Array.from(live, (el) => el.textContent.trim()).filter(Boolean);
  if (text.length) out.status = text.join(' · ');
  return out;
}
// Undo what the behaviour changed while setting up (StrictMode mounts effects twice in development).
function undo(records) {
  for (let i = records.length - 1; i >= 0; i--) {
    const r = records[i];
    if (r.type === 'attributes') {
      if (r.oldValue === null) r.target.removeAttribute(r.attributeName); else r.target.setAttribute(r.attributeName, r.oldValue);
    } else if (r.type === 'characterData') {
      r.target.data = r.oldValue;
    } else {
      r.addedNodes.forEach((n) => { if (n.parentNode === r.target) r.target.removeChild(n); });
      r.removedNodes.forEach((n) => { r.target.insertBefore(n, r.nextSibling && r.nextSibling.parentNode === r.target ? r.nextSibling : null); });
    }
  }
}

/* ---------- markup ---------- */
const Markup = memo(function Markup({ variant, uid }) {
  switch (variant) {
${markup.replace(`    case ${JSON.stringify(def)}:`,'    default:\n    case '+JSON.stringify(def)+':')}
  }
});

export default function ${name}({ variant = ${JSON.stringify(def)}, mode = ${JSON.stringify(o.mode)}, className = '', onStateChange, ...rest }) {
  useAtlasStyles();
  const ref = useRef(null);
  const uid = useId().replace(/:/g, '');
  const [state, setState] = useState(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const ac = new AbortController();
    const setup = new MutationObserver(() => {});
    setup.observe(root, { subtree: true, childList: true, attributes: true, attributeOldValue: true, characterData: true, characterDataOldValue: true });
    withSignal(ac.signal, () => behaviour(root, ac.signal));
    const changes = setup.takeRecords();
    setup.disconnect();
    let last = '';
    const sync = () => { const s = readState(root); const k = JSON.stringify(s); if (k !== last) { last = k; setState(s); } };
    const mo = new MutationObserver(sync);
    mo.observe(root, { subtree: true, childList: true, attributes: true, characterData: true });
    root.addEventListener('input', sync, { signal: ac.signal });
    sync();
    return () => { ac.abort(); mo.disconnect(); undo(changes); };
  }, [variant]);
  useEffect(() => { if (state && onStateChange) onStateChange(state); }, [state]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div ref={ref} key={variant} className={('cl-root ' + className).trim()} data-mode={mode} data-state={state ? 'live' : 'idle'} {...rest}>
      <Markup variant={variant} uid={uid} />
    </div>
  );
}
`;
 }

 /* ---------- files ---------- */
 const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
 const crc32=b=>{let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=CRC[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0;};
 function zipBlob(files){const enc=new TextEncoder(),parts=[],central=[];let off=0;const d=new Date(),time=(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1),date=((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate();
  for(const [name,data] of files){const n=enc.encode(name),b=typeof data==='string'?enc.encode(data):data,crc=crc32(b);
   const h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(10,time,true);h.setUint16(12,date,true);h.setUint32(14,crc,true);h.setUint32(18,b.length,true);h.setUint32(22,b.length,true);h.setUint16(26,n.length,true);
   parts.push(new Uint8Array(h.buffer),n,b);
   const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(12,time,true);c.setUint16(14,date,true);c.setUint32(16,crc,true);c.setUint32(20,b.length,true);c.setUint32(24,b.length,true);c.setUint16(28,n.length,true);c.setUint32(42,off,true);
   central.push(new Uint8Array(c.buffer),n);off+=30+n.length+b.length;}
  const size=central.reduce((s,a)=>s+a.length,0),e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,size,true);e.setUint32(16,off,true);
  return new Blob([...parts,...central,new Uint8Array(e.buffer)],{type:'application/zip'});}
 const fileName=c=>pascal(c.name)+'.jsx';
 function readme(o){const t=AtlasThemes.byId[o.theme]||AtlasThemes.list[0];const C=ComponentLab.components;
  return `# Atlas UI components for React

${C.length} self-contained React components exported from the Visual & Motion Atlas component lab.
Theme: ${t.id} ${t.name} · ${o.density} · default mode ${o.mode}. Requires React 18 or newer, nothing else.

\`\`\`jsx
import { TabGroups, Dialogs } from './atlas-components';

export default function App() {
  return <TabGroups mode="dark" onStateChange={(s) => console.log(s.selected)} />;
}
\`\`\`

## How each file works

- **Markup**: every real variant of the component as JSX. \`variant\` picks one; ids are scoped with \`useId\`, so several
  instances can share a page.
- **Styles**: the component CSS plus light and dark theme tokens, injected once per page. The same text is exported as
  \`css\` if you would rather put it in a stylesheet (then delete \`useAtlasStyles()\`).
- **Behaviour**: the exact keyboard, pointer and ARIA behaviour of the atlas live demo, mounted in \`useEffect\` on a ref.
  Every listener is tied to an AbortController, so unmounting and StrictMode's double mount clean up after themselves.
- **State**: the component's ARIA state (checked, pressed, expanded, selected, current, value…) is mirrored into
  \`useState\` and reported through \`onStateChange\`.

## Props

| prop | type | |
| --- | --- | --- |
| variant | string | see \`variants\` exported by each file |
| mode | "light" \\| "dark" | colour mode |
| onStateChange | (state) => void | called whenever the ARIA state changes |
| ...rest | | passed to the wrapping \`<div class="cl-root">\` |

## Components

${C.map(c=>`- \`${pascal(c.name)}\` (${c.id}) · ${variantsOf(c).map(v=>v[0]).join(', ')}`).join('\n')}

Fonts load from Google Fonts unless the theme uses system fonts.
`;}
 function files(o){o=opts(o);const C=ComponentLab.components;
  return [...C.map(c=>['atlas-components/components/'+fileName(c),code(c,o)]),
   ['atlas-components/index.js',C.map(c=>`export { default as ${pascal(c.name)} } from './components/${fileName(c)}';`).join('\n')+'\n'],
   ['atlas-components/README.md',readme(o)]];}
 const save=(blob,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},800);};
 window.ComponentReact={code,jsx,files,fileName,pascal,variantsOf,
  download(c,o){save(new Blob([code(c,o)],{type:'text/jsx'}),fileName(c));},
  zip(o){const f=files(o);return zipBlob(f);},
  downloadZip(o){save(zipBlob(files(o)),'atlas-components-react.zip');}};
})();
