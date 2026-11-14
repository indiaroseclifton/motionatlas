'use strict';
/* Icon families (atlas.html#icons): one card per look, a look bar (colour, size, tile) that
   restyles every monochrome family live, an inspect panel with per-icon "add to project",
   and IconPicker, the dialog the project page uses to pick any icon of any family.
   Specimens come from icons/specimens.json (SpecimenAtlas); whole families from icons/sets/. */
const IconLibrary={
 sources:{thin:'https://phosphoricons.com/',light:'https://phosphoricons.com/',regular:'https://phosphoricons.com/',bold:'https://phosphoricons.com/',fill:'https://phosphoricons.com/',duotone:'https://phosphoricons.com/','hero-outline':'https://heroicons.com/','hero-solid':'https://heroicons.com/',lucide:'https://lucide.dev/',tabler:'https://tabler.io/icons',pixel:'https://pixelarticons.com/free/',openmoji:'https://github.com/hfg-gmuend/openmoji','fluent-3d':'https://github.com/microsoft/fluentui-emoji',broken:'https://www.figma.com/community/file/1166831539721848736','bold-duotone':'https://www.figma.com/community/file/1166831539721848736',rounded:'https://fonts.google.com/icons',pencil:'https://pepicons.com/','flat-color':'https://icons8.com/icons/color','two-tone':'https://iconpark.oceanengine.com/',game:'https://game-icons.net/',brand:'https://simpleicons.org/',animated:'https://github.com/cyberalien/line-md'},
 counts:{},
 index:null,
 presets:[['Ink','#171a1e'],['Slate','#565c66'],['Blue','#214ee7'],['Green','#1f7a4d'],['Rust','#b4462a'],['Plum','#6b3fa0']],
 sizes:{s:36,m:48,l:64},
 look:{colour:'#171a1e',size:'m',tile:'tint'},
 variant:{},
 manifests:{},
 count(id){return this.counts[id]||'';},
 family(id){return SpecimenAtlas.families.find(f=>f[0]===id);},
 locked(id){return SpecimenAtlas.colourLocked.includes(id);},
 init(){
  try{const l=JSON.parse(localStorage.getItem('atlas-icon-look')||'null');if(l&&/^#[0-9a-f]{6}$/i.test(l.colour)&&this.sizes[l.size]&&['tint','plain','round','circle'].includes(l.tile))this.look=l;}catch{}
  SpecimenAtlas.looks.forEach(l=>{this.variant[l.id]=l.families[0];});
  fetch('icons/index.json').then(r=>r.ok?r.json():null).then(d=>{if(!d)return;this.index=d;d.families.forEach(f=>this.counts[f.id]=f.count);this.render();}).catch(()=>{});
  SpecimenAtlas.ready().then(()=>this.render());
  const sel=$('#iconFamilySelect');if(!sel)return;
  sel.innerHTML=this.familyOptions();
  sel.value='regular';
  for(const id of ['iconSearch','iconSize','iconFamilySelect'])$('#'+id).oninput=()=>this.render();
  $('#iconLookBar').addEventListener('click',e=>{const b=e.target.closest('button[data-look]');if(!b)return;const [k,v]=b.dataset.look.split(':');this.setLook({[k]:v});});
  document.addEventListener('click',e=>{
   const v=e.target.closest('[data-icon-variant]');if(v){const [look,fam]=v.dataset.iconVariant.split(':');this.variant[look]=fam;this.renderCards();return;}
   const pk=e.target.closest('[data-icon-pick]');if(pk){const [family,name]=pk.dataset.iconPick.split('/');window.ProjectAtlas?.pick({type:'iconPick',family,name,colour:this.look.colour});return;}
   const b=e.target.closest('[data-icon-family]');if(b){sel.value=b.dataset.iconFamily;this.render();$('#iconFamilies').scrollIntoView({behavior:'smooth',block:'start'});}
  });
  this.render();
 },
 familyOptions(){return SpecimenAtlas.looks.map(l=>`<optgroup label="${l.title}">${l.families.map(id=>{const f=this.family(id);return `<option value="${id}">${f?f[1]:id}</option>`;}).join('')}</optgroup>`).join('');},
 setLook(part,live=false){Object.assign(this.look,part);if(live){this.paint();return;}try{localStorage.setItem('atlas-icon-look',JSON.stringify(this.look));}catch{}this.render();},
 paint(){const L=this.look,wrap=$('#iconFamilyCards');if(!wrap)return;wrap.dataset.tile=L.tile;wrap.style.setProperty('--icon-size',this.sizes[L.size]+'px');wrap.style.color=L.colour;const sp=$('#iconFamilies .iconSpecimens');if(sp&&!this.locked($('#iconFamilySelect').value))sp.style.color=L.colour;},
 glyphs(family,n){return SpecimenAtlas.cardIcons(family,n).map(it=>SpecimenAtlas.glyph(it)).join('');},
 renderLookBar(){
  const L=this.look,on=(k,v)=>`aria-pressed="${String(L[k]===v)}"`,custom=!this.presets.some(([,c])=>c===L.colour);
  $('#iconLookBar').innerHTML=`<div class="iconLookGroup" role="group" aria-label="Colour"><span>Colour</span>${this.presets.map(([n,c])=>`<button type="button" class="iconSwatch" data-look="colour:${c}" ${on('colour',c)} aria-label="${n}" title="${n}"><i style="background:${c}"></i></button>`).join('')}<label class="iconSwatch iconSwatchCustom"${custom?' data-on="true"':''} title="Custom colour"><span class="visuallyHidden">Custom colour</span><input id="iconColour" type="color" value="${L.colour}"><i${custom?` style="background:${L.colour}"`:''}></i></label></div><div class="iconLookGroup" role="group" aria-label="Size"><span>Size</span>${[['s','S'],['m','M'],['l','L']].map(([v,t])=>`<button type="button" data-look="size:${v}" ${on('size',v)} aria-label="Size ${t}">${t}</button>`).join('')}</div><div class="iconLookGroup" role="group" aria-label="Tile"><span>Tile</span>${[['tint','Tint'],['plain','Plain'],['round','Round'],['circle','Circle']].map(([v,t])=>`<button type="button" data-look="tile:${v}" ${on('tile',v)}>${t}</button>`).join('')}</div>`;
  const c=$('#iconColour');c.oninput=e=>{this.setLook({colour:e.target.value},true);c.nextElementSibling.style.background=e.target.value;};c.onchange=e=>this.setLook({colour:e.target.value});
 },
 renderCards(){
  const q=($('#iconSearch').value||'').trim().toLowerCase(),wrap=$('#iconFamilyCards');
  const looks=SpecimenAtlas.looks.filter(l=>!q||[l.title,l.blurb,...l.families.map(id=>this.family(id)?.[1]||'')].join(' ').toLowerCase().includes(q));
  wrap.innerHTML=looks.map(l=>{const fam=this.variant[l.id]||l.families[0],f=this.family(fam)||[fam,fam,''],locked=this.locked(fam),vendor=f[1].split(' / ')[0];
   return `<article class="iconChoice" data-look-id="${l.id}" data-family="${fam}"${locked?' data-locked="true"':''}><button type="button" class="iconChoiceart" data-icon-family="${fam}" data-iconlook="${fam}" aria-label="Inspect ${f[1]}">${this.glyphs(fam,4)}</button><h2><button type="button" data-icon-family="${fam}">${l.title}</button></h2><p>${l.blurb}</p>${l.families.length>1?`<div class="iconVariants" role="group" aria-label="${l.title} draws">${l.families.map(id=>`<button type="button" data-icon-variant="${l.id}:${id}" aria-pressed="${String(id===fam)}">${l.labels?.[id]||this.family(id)?.[1]||id}</button>`).join('')}</div>`:''}<p class="iconChoiceMeta">${f[1]}${locked?' · colour is part of the artwork':''}</p><button type="button" class="quiet" data-icon-family="${fam}">Inspect →</button><span aria-hidden="true" class="iconDot">·</span><a class="quiet" href="icons.html?family=${fam}" aria-label="All ${this.count(fam)} ${f[1]} icons">All ${this.count(fam)} ${vendor} icons →</a></article>`;}).join('')||'<p>No matching looks. Clear the search or choose a family below.</p>';
  this.paint();
 },
 renderInspect(){
  const L=this.look,sel=$('#iconFamilySelect'),f=this.family(sel.value)||this.family('regular'),[fid,t,d]=f,locked=this.locked(fid),idx=this.index?.families.find(x=>x.id===fid),spec=SpecimenAtlas.specimens(fid);
  const lic=idx?`${idx.licence} · ${idx.source}`:'Licence included in every download';
  $('#iconFamilies').innerHTML=`<article class="iconFamily" data-family="${fid}"><div><h2>${t}</h2><p>${d}</p><p class="iconLicense">${lic}. ${locked?'Colour is part of this family’s artwork, so the look colour does not apply.':'Drawn in currentColor, so each icon takes the colour you give it.'}</p><button type="button" class="quiet" data-project-icon="${fid}">Add this family to project</button><a class="secondary" href="icons.html?family=${fid}">Browse all ${this.count(fid)} icons →</a><a class="secondary" href="icons/packs/${fid}.zip" download>Download full pack ZIP ↓</a><a class="quiet" href="icons/packs/${fid}-specimens.zip" download>${spec.length} specimens only ↓</a><a class="quiet" href="${this.sources[fid]||'icons.html'}" target="_blank" rel="noopener">Full library &amp; original downloads ↗</a></div><div class="iconSpecimens" style="--icon-size:${$('#iconSize').value}px${locked?'':`;color:${L.colour}`}">${spec.map(it=>`<span><span class="iconSpecimen">${SpecimenAtlas.glyph(it)}<button type="button" class="iconPick" data-icon-pick="${fid}/${it.n}" aria-label="Add ${it.n.replace(/-/g,' ')} to a project">+</button></span><small>${it.n.replace(/-/g,' ')}</small></span>`).join('')}</div></article>`;
 },
 render(){if(!$('#iconLookBar'))return;this.renderLookBar();this.renderCards();this.renderInspect();},
 /* any icon of any family, for project tiles and the picker */
 manifest(fid){return this.manifests[fid]||(this.manifests[fid]=fetch(`icons/sets/${fid}.json`).then(r=>r.ok?r.json():null).catch(()=>null));},
 async glyphFor(fid,name){const sp=SpecimenAtlas.specimens(fid).find(i=>i.n===name);if(sp)return SpecimenAtlas.glyph(sp);const m=await this.manifest(fid);const it=m?.icons.find(i=>i.n===name);return it?SpecimenAtlas.glyph(it):'';}
};
const IconPicker={
 fam:'regular',q:'',shown:0,list:[],CHUNK:96,bound:false,
 open(){const d=$('#iconPicker');if(!d)return;
  if(!this.bound){this.bound=true;const sel=$('#iconPickerFamily');sel.innerHTML=IconLibrary.familyOptions();sel.value=this.fam;sel.oninput=()=>{this.fam=sel.value;this.load();};$('#iconPickerSearch').oninput=e=>{this.q=e.target.value;this.draw();};$('#iconPickerColour').value=IconLibrary.look.colour;$('#iconPickerColour').oninput=e=>{$('#iconPickerGrid').style.color=e.target.value;};$('#iconPickerGrid').addEventListener('click',e=>{const m=e.target.closest('[data-more]');if(m){this.draw(false);return;}const b=e.target.closest('button[data-name]');if(!b)return;if(window.ProjectAtlas?.addPick({family:this.fam,name:b.dataset.name,colour:$('#iconPickerColour').value}))b.classList.add('picked');});$('#closeIconPicker').onclick=()=>d.close();}
  if(!d.open)d.showModal();this.load();},
 async load(){$('#iconPickerStatus').textContent='Loading…';const m=await IconLibrary.manifest(this.fam);this.list=m?m.icons:[];this.draw();},
 draw(reset=true){const g=$('#iconPickerGrid'),terms=this.q.trim().toLowerCase().split(/\s+/).filter(Boolean),all=terms.length?this.list.filter(i=>terms.every(t=>(i.n+' '+(i.k||'')).includes(t))):this.list;
  if(reset){this.shown=0;g.innerHTML='';}g.querySelector('.iconPickerMore')?.remove();
  const next=all.slice(this.shown,this.shown+this.CHUNK);
  g.insertAdjacentHTML('beforeend',next.map(i=>`<li><button type="button" data-name="${i.n}" aria-label="Add ${i.n.replace(/-/g,' ')}">${SpecimenAtlas.glyph(i)}<small>${i.n.replace(/-/g,' ')}</small></button></li>`).join(''));
  this.shown+=next.length;
  if(this.shown<all.length)g.insertAdjacentHTML('beforeend',`<li class="iconPickerMore"><button type="button" class="secondary" data-more>Show ${Math.min(this.CHUNK,all.length-this.shown)} more</button></li>`);
  g.style.color=$('#iconPickerColour').value;
  $('#iconPickerStatus').textContent=all.length?`${all.length} icons · click one to add it with the colour above`:(this.list.length?'No icons match. Try another word or family.':'This family could not load. Check your connection and try again.');}
};
window.IconLibrary=IconLibrary;window.IconPicker=IconPicker;
