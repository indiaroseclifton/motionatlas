'use strict';
const SpecimenAtlas={
 icon(name='house',family='regular'){return `<img class="libraryIcon" src="icons/${family}/${name}.${family==='fluent-3d'?'png':'svg'}" alt="" aria-hidden="true">`;},
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
 families:[['thin','Phosphor / Thin','Fine linework for spacious interfaces.'],['light','Phosphor / Light','A restrained stroke with generous breathing room.'],['regular','Phosphor / Regular','Balanced outlines for everyday product UI.'],['bold','Phosphor / Bold','A stronger silhouette for small controls.'],['fill','Phosphor / Fill','Solid forms for selected states and compact navigation.'],['duotone','Phosphor / Duotone','Two tonal layers distinguish the foreground from structure.'],['hero-outline','Heroicons / Outline','Rounded 24 px outlines for contemporary web UI.'],['hero-solid','Heroicons / Solid','Compact filled forms from the same Heroicons family.'],['lucide','Lucide / Outline','Consistent 24 px linework and open shapes.'],['tabler','Tabler / Outline','Clear geometric outlines on a 24 px grid.'],['pixel','Pixelarticons / Pixel','Stepped silhouettes and a deliberate pixel grid for retro interfaces.'],['openmoji','OpenMoji / Colour pictograms','Expressive coloured SVG pictograms by the OpenMoji contributors.'],['fluent-3d','Fluent Emoji / 3D','Dimensional PNG emoji from Microsoft with material, colour and lighting.']],
 icons:['house','magnifying-glass','heart','bookmark-simple','bell','gear','calendar-blank','folder','user','check-circle','plus','upload-simple'],
 init(){IconLibrary.init();}
};window.SpecimenAtlas=SpecimenAtlas;
