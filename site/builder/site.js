'use strict';
/* Page builder, the site model: pages, shared header and footer, menu, settings, slugs, links and SEO helpers.
   A site is {id,name,brand,style,pair,home,pages:[{id,name,slug,title,desc,og,inNav,blocks}],header:[block],footer:[block],
   navAuto,nav:[{label,link}],settings:{...}}. A block is {uid,id,vals}. A link is '' | 'page:<id>' | any URL.
   Pure functions only (no DOM), so the same code builds the editor preview, the ZIP and the published site. */
(()=>{
const PB=window.PB=window.PB||{};
const uid=(p='b')=>p+Math.random().toString(36).slice(2,8);
const slugify=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,48);
const RESERVED=['index','404','assets','sitemap','robots'];
function uniqueSlug(site,base,exceptId){let s=slugify(base)||'page';if(RESERVED.includes(s))s+='-page';const taken=n=>site.pages.some(p=>p.id!==exceptId&&p.slug===n);let n=s,i=2;while(taken(n))n=s+'-'+i++;return n}
const DEFAULTS=()=>({lang:'en',url:'',description:'',favicon:{set:'glyphs',name:'spark'},ogImage:'',analytics:'',formAction:'',
 notFound:{on:true,title:'This page has wandered off',text:'The page you were looking for isn’t here. It may have moved, or the link may have a typo.',button:'Back to the home page'}});
const NAV_DEF={nav:['Episodes','Pricing','Questions'],'nav-center':['Work','Studio','Journal']};
const isPost=p=>!!p&&p.kind==='post';
const posts=site=>site.pages.filter(isPost).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
function rfc822(d){const t=new Date((d||'')+'T09:00:00Z');return isNaN(t)?new Date().toUTCString():t.toUTCString()}
function newPage(site,name,blocks){const p={id:uid('pg'),name:name||'New page',slug:'',title:'',desc:'',og:'',inNav:true,blocks:blocks||[]};p.slug=uniqueSlug(site,p.name);return p}
const isTop=d=>!!d&&(d.place==='top'||d.id==='announce'),isEnd=d=>!!d&&d.place==='end';
/* split a flat block list into shared header, page and shared footer */
function split(blocks,def){const header=[],body=[],footer=[];(blocks||[]).forEach(b=>{const d=def(b.id);if(!d)return;(isTop(d)?header:isEnd(d)?footer:body).push(b)});return {header,body,footer}}
/* Build a clean site from anything: a whole site, an old single page {blocks,title,brand,style,...}, or a template. */
function normalize(x,def){
 x=x||{};const s={id:x.id||uid('s'),name:x.name||x.brand||'My site',brand:x.brand||'Brand',style:x.style||'studio',pair:x.pair==null?-1:x.pair,updated:x.updated||0};if(x.rich===2)s.rich=2;if(typeof x.logo==='string'&&/^data:image\/svg\+xml/.test(x.logo)&&x.logo.length<30000)s.logo=x.logo;
 if(Array.isArray(x.pages)&&x.pages.length){
  s.pages=x.pages.map(p=>({id:p.id||uid('pg'),name:String(p.name||'Page').slice(0,60),slug:slugify(p.slug)||'',title:String(p.title||'').slice(0,80),desc:String(p.desc||'').slice(0,300),og:String(p.og||'').slice(0,300),inNav:p.inNav!==false,...(p.kind==='post'?{kind:'post',date:/^\d{4}-\d{2}-\d{2}$/.test(p.date||'')?p.date:new Date().toISOString().slice(0,10)}:{}),blocks:fix(p.blocks,def)}));
  s.header=fix(x.header,def);s.footer=fix(x.footer,def);
 }else{ // old single page: nav and footer blocks become the shared header and footer
  const sp=split(fix(x.blocks,def),def);
  s.pages=[{id:uid('pg'),name:'Home',slug:'index',title:x.title||'',desc:'',og:'',inNav:true,blocks:sp.body}];s.header=sp.header;s.footer=sp.footer;
  // the old nav had three fixed link words; keep them as menu entries
  const nb=(x.blocks||[]).find(b=>b&&NAV_DEF[b.id]);
  if(nb){const v=nb.vals||{},d=NAV_DEF[nb.id];s.navAuto=false;s.navSeed=!(v.l1||v.l2||v.l3);s.nav=[1,2,3].map((n,i)=>({label:String(v['l'+n]||d[i]).slice(0,40),link:''}));const nbk=s.header.find(b=>b.uid===nb.uid||b.id===nb.id);if(nbk){delete nbk.vals.l1;delete nbk.vals.l2;delete nbk.vals.l3}}
 }
 s.pages.forEach(p=>{if(!p.slug)p.slug=uniqueSlug({pages:s.pages},p.name,p.id)});
 // slugs unique, home exists
 const seen=new Set();s.pages.forEach(p=>{let b=p.slug,n=b,i=2;while(seen.has(n))n=b+'-'+i++;p.slug=n;seen.add(n)});
 s.home=s.pages.some(p=>p.id===x.home)?x.home:s.pages[0].id;
 if(s.navAuto==null)s.navAuto=x.navAuto!==false;if(s.navSeed==null)s.navSeed=!!x.navSeed;
 if(!s.nav)s.nav=(Array.isArray(x.nav)?x.nav:[]).map(n=>({label:String(n.label||'Link').slice(0,40),link:String(n.link||'').slice(0,500)}));
 const d=DEFAULTS(),st=x.settings||{};s.settings={...d,...st,favicon:{...d.favicon,...(st.favicon||{})},notFound:{...d.notFound,...(st.notFound||{})}};
 if(x.tokens&&typeof x.tokens==='object'){const t={},k=x.tokens,hex=v=>/^#[0-9a-f]{6}$/i.test(v);['bg','surface','ink','accent'].forEach(n=>{if(hex(k[n]))t[n]=k[n]});if(k.radius!=null&&+k.radius>=0&&+k.radius<=40)t.radius=+k.radius;if(['sharp','pill'].includes(k.btn))t.btn=k.btn;['fontHead','fontBody'].forEach(n=>{if(/^[\w ]{2,40}$/.test(k[n]||''))t[n]=k[n]});if(Object.keys(t).length)s.tokens=t}
 return s}
function fix(list,def){return (list||[]).filter(b=>b&&(!def||def(b.id))).map(b=>{const o={uid:b.uid||uid(),id:b.id,vals:b.vals||{}};if(b.set&&typeof b.set==='object')o.set=b.set;if(b.links&&typeof b.links==='object')o.links=b.links;if(b.rich&&typeof b.rich==='object')o.rich=b.rich;if(b.cfg&&typeof b.cfg==='object'&&Object.keys(b.cfg).length)o.cfg=b.cfg;return o})}
const safeLink=l=>{l=String(l||'').trim();if(!l)return '#';if(/^\s*(javascript|data|vbscript):/i.test(l))return '#';return l};
/* menu: the pages (in order) or the custom list; each item {label,link} */
function menu(site){if(site.navAuto)return site.pages.filter(p=>p.inNav).map(p=>({label:p.name,link:'page:'+p.id,pageId:p.id}));
 return site.nav.map(n=>({label:n.label,link:n.link,pageId:/^page:/.test(n.link)?n.link.slice(5):null}))}
const pageOf=(site,id)=>site.pages.find(p=>p.id===id)||site.pages[0];
const pageFile=(site,p)=>p.id===site.home?'index.html':p.slug+'.html';
/* resolve a link for a context: ctx.pageHref(page) -> string */
function href(site,link,ctx){link=String(link||'');if(/^page:/.test(link)){const p=site.pages.find(x=>x.id===link.slice(5));return p&&ctx&&ctx.pageHref?ctx.pageHref(p):'#'}return safeLink(link)}
function menuHTML(site,items,ctx,esc){return items.map(it=>{const cur=it.pageId&&ctx.current===it.pageId;return `<a href="${esc(href(site,it.link,ctx))}"${cur?' aria-current="page"':''}${ctx.mode==='preview'?' data-pbm':''}>${esc(it.label)}</a>`}).join('')}
/* generic: a button or link whose text is exactly a page's name goes to that page */
function linkPages(site,html,ctx,esc){const by=new Map(site.pages.map(p=>[p.name.trim().toLowerCase(),p]));
 return html.replace(/<a ([^>]*?)href="#"([^>]*)>([^<]{1,60})<\/a>/g,(m,a,b,t)=>{const p=by.get(t.replace(/\s*→\s*$/,'').trim().toLowerCase());return p?`<a ${a}href="${esc(ctx.pageHref(p))}"${b}>${t}</a>`:m})}
/* favicon as an SVG string, drawn in the accent colour */
function faviconSVG(site,accent,PBL){const f=(site.settings||{}).favicon||{};accent=accent||'#5B2DFF';
 if(f.set==='letter'||!f.name){const l=(site.brand||'A').trim().charAt(0).toUpperCase()||'A';return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${accent}"/><text x="32" y="44" font-family="Georgia,serif" font-size="38" font-weight="700" text-anchor="middle" fill="#fff">${l.replace(/[<&]/g,'')}</text></svg>`}
 let inner='';
 if(f.set==='glyphs'){const d=((PBL||window.PB_LIB||{}).glyphs||{})[f.name]||((PBL||window.PB_LIB||{}).glyphs||{}).spark||'';inner=`<path d="${d}" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`;}
 else{const c=PB.iconCache&&PB.iconCache[f.set+'/'+f.name+'.svg'];if(c){const m=c.match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>/);if(m)return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${accent}"/><svg x="14" y="14" width="36" height="36" viewBox="${m[1]}" fill="#fff" color="#fff">${m[2].replace(/currentColor/g,'#fff')}</svg></svg>`}}
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${accent}"/><svg x="14" y="14" width="36" height="36" viewBox="0 0 24 24">${inner}</svg></svg>`}
const svgDataURL=s=>'data:image/svg+xml,'+encodeURIComponent(s).replace(/'/g,'%27').replace(/\(/g,'%28').replace(/\)/g,'%29');
const escX=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function sitemap(site,base,today){const u=base.replace(/\/?$/,'/');return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+site.pages.map(p=>`  <url><loc>${escX(u+(p.id===site.home?'':p.slug+'.html'))}</loc><lastmod>${p.date||today}</lastmod><priority>${p.id===site.home?'1.0':'0.7'}</priority></url>`).join('\n')+'\n</urlset>\n'}
const robots=base=>`User-agent: *\nAllow: /\n`+(base?`Sitemap: ${base.replace(/\/?$/,'/')}sitemap.xml\n`:'');
PB.site={isPost,posts,rfc822,uid,slugify,uniqueSlug,newPage,normalize,split,menu,pageOf,pageFile,href,menuHTML,linkPages,faviconSVG,svgDataURL,sitemap,robots,safeLink,DEFAULTS,isTop,isEnd};
})();
