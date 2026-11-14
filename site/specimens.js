'use strict';
const SpecimenAtlas={
 icon(name='house',family='regular'){return `<img class="libraryIcon" loading="lazy" decoding="async" src="icons/${family}/${name}.${family==='fluent-3d'?'png':'svg'}" alt="" aria-hidden="true">`;},
 thumbnail(e){const n=Number(e.id.slice(1)),pill=(t,c='')=>`<span class="specPill ${c}">${t}</span>`,row=t=>`<div class="specRow">${t}</div>`,field=(label,value,c='')=>`<div class="specField ${c}"><small>${label}</small><span>${value}</span></div>`,icon=(name)=>this.icon(name);let h='';
 const names=['Save changes','Preview','Delete'];
 if(n===1)h=`<div class="specStack">${names.map((t,i)=>pill(t,['strong','','danger'][i])).join('')}</div>`;
 if(n===2)h=`<div class="specIconrow">${['heart','bookmark-simple','plus','magnifying-glass'].map(t=>`<span>${icon(t)}</span>`).join('')}</div>`;
 if(n===3)h=field('Project name','A new direction')+'<small>Give your project a memorable name.</small>';
 if(n===4)h=field('Creative brief','A calmer way to plan.<br>Clear hierarchy. Room for ideas.')+'<small>72 / 400 characters</small>';
 if(n===5)h=field('Project phase','Making ↓')+`<div class="specMenu">${['Planning','Making','Review'].map(t=>row(t+(t==='Making'?' ✓':''))).join('')}</div>`;
 if(n===6)h=field('Find a project','Garden')+row('Garden event')+row('Garden notes');
 if(n===7)h=['Artwork','Build notes','Source links'].map((t,i)=>row(`<span class="specCheck ${i!==1?'checked':''}">${i!==1?'✓':''}</span>${t}`)).join('');
 if(n===8)h=['Digital','Printed','Both'].map((t,i)=>row(`<span class="specRadio ${!i?'checked':''}"></span>${t}`)).join('');
 if(n===9)h=['Notifications','Sound'].map((t,i)=>row(`${t}<span class="specSwitch ${!i?'on':''}"></span>`)).join('');
 if(n===10)h=`<b>Intensity <em>64%</em></b><div class="specTrack"><i style="width:64%"></i><span></span></div><small>Subtle <em>Expressive</em></small>`;
 if(n===11)h=field('Review date','October 16, 2026')+`<div class="specDate"><b>16</b><span>Friday<br>Design review</span></div>`;
 if(n===12)h=`<b>October 2026</b><div class="specCalendar">${['M','T','W','T','F','S','S',...Array.from({length:21},(_,i)=>i+1)].map(t=>`<span class="${t===16?'selected':''}">${t}</span>`).join('')}</div>`;
 if(n===13)h=`<div class="specUpload">${icon('upload-simple')}<b>Drop your artwork</b><small>Images, GIFs and clips</small></div>${row('cover.jpg <em>Ready ✓</em>')}`;
 if(n===14)h=field('Email','india@','invalid')+'<span class="specError">Enter a complete email address.</span>'+field('Project name','Garden event','valid');
 if(n===15)h=field('Search collection','glass')+`<div class="specChips">${pill('Glass ×','strong')}${pill('Calm ×')}</div>`+row('Translucent layers')+row('Functional glass');
 if(n===16)h=`<div class="specTrail">Library <span>/</span> Projects <span>/</span><b>Garden event</b></div><div class="specGhostpage"><b>Garden event</b><small>Your current location</small></div>`;
 if(n===17)h=`<div class="specTabs">${pill('Brief','strong')}${pill('Assets')}${pill('Activity')}</div><b>Project brief</b><p>A clear direction for the work ahead.</p>`;
 if(n===18)h=`<div class="specSidebar"><aside>${['Library','Projects','Assets'].map((t,i)=>row(`<span class="${i===1?'selected':''}">${t}</span>`)).join('')}</aside><div><b>Projects</b>${row('Garden event')}${row('Studio launch')}</div></div>`;
 if(n===19)h=`<div class="specGhostpage"><b>Your collection</b></div><div class="specBottom">${['house','squares-four','bookmark-simple'].map((t,i)=>`<span>${icon(t)}<small>${['Home','Library','Saved'][i]}</small></span>`).join('')}</div>`;
 if(n===20)h=field('Command palette','Search actions…')+row('Create project <em>⌘ N</em>')+row('Find reference <em>⌘ K</em>');
 if(n===21)h=pill('Export options ↓','strong')+`<div class="specMenu">${row('Include notes ✓')}${row('Include references ✓')}${row('Export JSON')}</div>`;
 if(n===22)h=`<span class="specTooltip">Save this reference</span><div class="specIconrow"><span>${icon('bookmark-simple')}</span></div>`;
 if(n===23)h=`<div class="specModal"><b>Keep this direction?</b><p>Save your selected references.</p><div class="specChips">${pill('Cancel')}${pill('Save','strong')}</div></div>`;
 if(n===24)h=`<div class="specDrawer"><b>Reference details</b>${field('Title','Glass study')}${pill('Save changes','strong')}</div>`;
 if(n===25)h=row('<b>Production notes −</b>')+'<p>Review the composition.<br>Check the export dimensions.</p>'+row('Delivery checklist +');
 if(n===26)h=`<div class="specToast">${icon('check-circle')}<span><b>Project saved</b><small>All changes are up to date.</small></span><em>Undo</em></div>`;
 if(n===27)h=`<div class="specNotice"><b>Connection interrupted</b><p>Your draft is still here.</p>${pill('Try again','strong')}</div>`;
 if(n===28)h=`<div class="specStack">${pill('In review','strong')}${pill('Approved','success')}${pill('Needs changes','danger')}</div>`;
 if(n===29)h=`<div class="specAvatarrow">${['IG','NG','AS'].map(t=>`<span>${t}<i></i></span>`).join('')}<small>Three people / one shared project</small></div>`;
 if(n===30)h=`<div class="specContentcard"><span>PROJECT / 024</span><b>Garden event</b><p>References selected.<br>Ready for the first draft.</p>${pill('Open project','strong')}</div>`;
 if(n===31)h=`<div class="specTable">${[['Project','Phase'],['Garden','Review'],['Studio','Making'],['Recipe','Planning']].map((a,i)=>`<div class="${!i?'selected':''}"><span>${a[0]}</span><span>${a[1]}</span></div>`).join('')}</div>`;
 if(n===32)h=`<div class="specGhostpage"><b>Page 02</b><small>Showing 13–24 of 48</small></div><div class="specChips">${['←','1','2','3','4','→'].map(t=>pill(t,t==='2'?'strong':'')).join('')}</div>`;
 if(n===33)h=`${row('▾ Projects')}${row('　▾ Garden event')}${row('　　Artwork')}${row('　　Build notes')}${row('　▸ Studio launch')}`;
 if(n===34)h=`<div class="specSteps">${['Brief','Design','Review'].map((t,i)=>`<span class="${i<2?'selected':''}"><b>${i===0?'✓':i+1}</b>${t}</span>`).join('')}</div>`;
 if(n===35)h=`<b>Uploading artwork <em>64%</em></b><div class="specTrack"><i style="width:64%"></i></div>${row('8 of 12 files')}<div class="specChips">${pill('Queued')}${pill('Complete ✓','success')}</div>`;
 if(n===36)h=`<div class="specSkeleton"><span></span><div><i></i><i></i><i></i></div></div><small>Loading your collection…</small>`;
 if(n===37)h=`<div class="specEmpty">${icon('bookmark-simple')}<b>Your next idea starts here.</b><small>Save your first reference.</small>${pill('Explore the atlas','strong')}</div>`;
 if(n===38)h=`<div class="specCarousel">${['A17','A23','A18'].map(id=>`<div>${imageHTML(find(id).applied)}</div>`).join('')}</div><div class="specChips">${pill('←')}${pill('02 / 03','strong')}${pill('→')}</div>`;
 if(n===39)h=`<div class="specSplit"><div><b>Library</b>${row('Glass')}${row('Paper')}</div><span></span><div><b>Inspector</b><p>Notes and properties</p></div></div>`;
 if(n===40)h=`<div class="specResponsive"><div><b>Desktop</b>${row('Projects · Assets')}${row('Garden / Studio')}</div><div><b>Phone</b>${row('Garden')}${row('Studio')}</div></div>`;
 return `<div class="componentPlate" data-componentplate="${e.id}" aria-hidden="true" inert><div class="specComposition">${h}</div></div>`;
 },
 families:[['thin','Phosphor / Thin','Fine linework for spacious interfaces.'],['light','Phosphor / Light','A restrained stroke with generous breathing room.'],['regular','Phosphor / Regular','Balanced outlines for everyday product UI.'],['bold','Phosphor / Bold','A stronger silhouette for small controls.'],['fill','Phosphor / Fill','Solid forms for selected states and compact navigation.'],['duotone','Phosphor / Duotone','Two tonal layers distinguish the foreground from structure.'],['hero-outline','Heroicons / Outline','Rounded 24 px outlines for contemporary web UI.'],['hero-solid','Heroicons / Solid','Compact filled forms from the same Heroicons family.'],['lucide','Lucide / Outline','Consistent 24 px linework and open shapes.'],['tabler','Tabler / Outline','Clear geometric outlines on a 24 px grid.'],['pixel','Pixelarticons / Pixel','Stepped silhouettes and a deliberate pixel grid for retro interfaces.'],['openmoji','OpenMoji / Colour pictograms','Expressive coloured SVG pictograms by the OpenMoji contributors.'],['fluent-3d','Fluent Emoji / 3D','Dimensional PNG emoji from Microsoft with material, colour and lighting.'],['broken','Solar / Broken line','Outlines drawn with deliberate gaps, for a lighter, sketched feel.'],['bold-duotone','Solar / Bold duotone','Heavy forms with a translucent second tone for depth.'],['rounded','Material Symbols / Rounded','Chunky filled shapes with soft corners, the Google look.'],['pencil','Pepicons / Pencil','Hand-drawn pencil strokes with a wobble.'],['flat-color','Flat Color Icons / Flat colour','Flat multicolour pictograms for dashboards and onboarding.'],['two-tone','Icon Park / Two-tone colour','Outlines with a blue second colour, for lively product UI.'],['game','Game Icons / Illustrative','Silhouette illustrations with real detail, for games and storytelling.'],['brand','Simple Icons / Brand logos','Monochrome marks of popular products and services.'],['animated','Line MD / Animated line','Line icons that draw themselves in when they appear.'],['tabler-filled','Tabler / Filled','Solid counterparts of the Tabler outlines.'],['iconoir','Iconoir / Outline','Light, friendly 1.5 px strokes with rounded joins.'],['iconoir-solid','Iconoir / Solid','Filled forms from the Iconoir family.'],['bootstrap','Bootstrap Icons / Outline','Sturdy 16 px outlines that stay clear at small sizes.'],['bootstrap-fill','Bootstrap Icons / Filled','The filled half of Bootstrap Icons.']],
 looks:[
  {id:'outline',title:'Outline',blurb:'Even strokes on a 24 px grid. Four Phosphor weights, with Lucide, Tabler, Heroicons, Iconoir and Bootstrap draws of the same idea.',families:['regular','thin','light','bold','lucide','tabler','hero-outline','iconoir','bootstrap'],labels:{regular:'Regular',thin:'Thin',light:'Light',bold:'Bold',lucide:'Lucide',tabler:'Tabler','hero-outline':'Heroicons',iconoir:'Iconoir',bootstrap:'Bootstrap'}},
  {id:'solid',title:'Solid',blurb:'Filled silhouettes for selected states and compact navigation.',families:['fill','hero-solid','tabler-filled','iconoir-solid','bootstrap-fill'],labels:{fill:'Phosphor','hero-solid':'Heroicons','tabler-filled':'Tabler','iconoir-solid':'Iconoir','bootstrap-fill':'Bootstrap'}},
  {id:'duotone',title:'Duotone',blurb:'Two tonal layers separate the subject from its structure.',families:['duotone']},
  {id:'broken',title:'Broken line',blurb:'Outlines drawn with deliberate gaps, for a lighter, sketched feel.',families:['broken']},
  {id:'bold-duotone',title:'Bold duotone',blurb:'Heavy forms with a translucent second tone for depth.',families:['bold-duotone']},
  {id:'rounded',title:'Rounded filled',blurb:'Chunky filled shapes with soft corners, the Google look.',families:['rounded']},
  {id:'pencil',title:'Hand-drawn',blurb:'Pencil strokes with a wobble, for friendly and editorial work.',families:['pencil']},
  {id:'pixel',title:'Pixel',blurb:'Stepped silhouettes on a deliberate pixel grid for retro interfaces.',families:['pixel']},
  {id:'two-tone',title:'Two-tone colour',blurb:'Outlines with a blue second colour, for lively product UI.',families:['two-tone']},
  {id:'flat-color',title:'Flat colour',blurb:'Flat multicolour pictograms for dashboards and onboarding.',families:['flat-color']},
  {id:'openmoji',title:'Colour pictograms',blurb:'Expressive coloured pictograms by the OpenMoji contributors.',families:['openmoji']},
  {id:'fluent-3d',title:'3D emoji',blurb:'Dimensional emoji with material, colour and lighting.',families:['fluent-3d']},
  {id:'game',title:'Illustrative',blurb:'Silhouette illustrations with real detail, for games and storytelling.',families:['game']},
  {id:'brand',title:'Brand logos',blurb:'Monochrome marks of popular products and services.',families:['brand']},
  {id:'animated',title:'Animated line',blurb:'Line icons that draw themselves in when they appear.',families:['animated']}],
 colourLocked:['openmoji','fluent-3d','flat-color','two-tone'],
 cardOrder:['house','heart','gear','folder','magnifying-glass','bell','user','calendar-blank','plus','check-circle','bookmark-simple','upload-simple','squares-four'],
 spec:null,
 ready(){return this._ready||(this._ready=fetch('icons/specimens.json').then(r=>r.ok?r.json():null).then(d=>{this.spec=d;return d;}).catch(()=>null));},
 specimens(family){const l=this.spec?.families?.[family]||[];if(l.length)return l;return this.icons.map(n=>({n,as:n,f:family==='fluent-3d'?`icons/${family}/${n}.png`:undefined,src:`icons/${family}/${n}.svg`}));},
 glyph(it){if(!it)return '';if(it.s)return `<span class="libraryIcon iconGlyph" aria-hidden="true">${it.s}</span>`;return `<img class="libraryIcon" loading="lazy" decoding="async" src="${it.f||it.src}" alt="" aria-hidden="true">`;},
 svg(name,family='regular'){const it=this.specimens(family).find(i=>(i.as||i.n)===name||i.n===name);return it?this.glyph(it):this.icon(name,family);},
 cardIcons(family,n=4){const l=this.specimens(family);if(family==='brand')return l.slice(0,n);const by=Object.fromEntries(l.map(i=>[i.as||i.n,i]));return this.cardOrder.map(k=>by[k]).filter(Boolean).slice(0,n);},
 icons:['house','magnifying-glass','heart','bookmark-simple','bell','gear','calendar-blank','folder','user','check-circle','plus','upload-simple','squares-four'],
 init(){IconLibrary.init();}
};window.SpecimenAtlas=SpecimenAtlas;
