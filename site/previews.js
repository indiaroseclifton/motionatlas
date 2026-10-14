'use strict';
// Inert, entry-specific component specimens. They contain no nested controls.
const AtlasPreviews={
 icon(path){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;},
 render(e){
 if(['E10','E14'].includes(e.id))return SpecimenAtlas.thumbnail({...e,id:e.id==='E10'?'C18':'C35'});
 if(e.id==='E04')return `<div class="componentPlate" aria-hidden="true" inert><div class="iconFamilyPreview">${['regular','fill','duotone'].map(f=>`<div><small>${f}</small>${['house','heart','gear'].map(n=>SpecimenAtlas.icon(n,f)).join('')}</div>`).join('')}<b>One symbol. Many voices.</b></div></div>`;
 if(e.id==='E15')return `<div class="componentPlate" aria-hidden="true" inert><div class="specComposition"><div class="specEmpty"><b>Ready for your first idea.</b><small>Save a reference to begin.</small></div><div class="specSkeleton"><span></span><div><i></i><i></i></div></div><div class="specNotice"><b>Couldn’t load references.</b><small>Your collection is safe. Try again.</small></div></div></div>`;

 const icon=p=>this.icon(p),block=(text,cls='')=>`<span class="pv-button ${cls}">${text}</span>`,line=t=>`<div class="pv-listrow">${t}</div>`,pointer=icon('<path d="m5 3 13 10-7 1-3 6Z"/>');
 const templates={
 E02:`<div class="pv-palette"><div style="background:#edf0ea;color:#203431">Surface<br><b>#EDF0EA</b></div><div style="background:#203431;color:#fff">Ink<br><b>#203431</b></div><div style="background:#799a8b;color:#10291f">Accent<br><b>#799A8B</b></div></div><div class="pv-materials"><span class="pv-paper">Paper</span><span class="pv-glass">Glass</span><span class="pv-solid">Solid</span></div>`,
 E04:`<div class="pv-icons">${[icon('<path d="m3 10 9-7 9 7v10h-6v-7H9v7H3Z"/>'),icon('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>'),icon('<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>'),icon('<path d="m4 12 5 5L20 5"/>'),icon('<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="#fff"/><circle cx="15" cy="17" r="3" fill="#fff"/>')].map((s,i)=>`<span>${s}<small>${['Home','Document','Search','Approve','Adjust'][i]}</small></span>`).join('')}</div><div class="pv-measure">24 px grid / 1.5 px stroke</div>`,
 E10:`<div class="pv-navsurface"><div class="pv-sidebar"><b>Library</b><span class="pv-selected">Projects</span><span>Assets</span><span>Archive</span></div><div class="pv-navcontent"><b>Projects</b><div class="pv-tabs"><span class="pv-selected">Active</span><span>Saved</span></div>${line('Garden event')}${line('Studio launch')}</div></div>`,
 E14:`<div class="pv-progress"><b>Uploading assets</b><div class="pv-track"><i style="width:64%"></i></div><span>64% / 8 of 12 files</span></div><div class="pv-statusrow"><span>Queued</span><span>In progress</span><span class="pv-success">Complete</span></div>`,
 E15:`<div class="pv-state"><b>Nothing saved yet</b><span>Save a reference to collect it.</span></div><div class="pv-state"><b>Loading references</b><div class="pv-skeleton"></div></div><div class="pv-state pv-error"><b>Could not load</b><span>Check connection. Retry.</span></div>`,
 M01:`<div class="pv-ghost">Design review ready</div><div class="pv-message pv-fade"><b>Design review ready</b><span>All three assets are available.</span></div><div class="pv-measure">opacity 0 → 1 / translate 12 → 0 px</div>`,
 M02:`<div class="pv-stagger">${['Brief received','References selected','First draft ready'].map((t,i)=>`<div class="pv-listrow" style="--delay:${i*60}ms"><span class="pv-step">${i+1}</span>${t}</div>`).join('')}</div><div class="pv-measure">0 / 60 / 120 ms</div>`,
 M03:`<div class="pv-springtrack"><div class="pv-springball"></div><span class="pv-restpoint">rest</span></div><div class="pv-measure">Release → overshoot → settle</div>`,
 M04:`<div class="pv-buttonstates">${block('Save','pv-rest')}${block('Save','pv-hover')}${block('Save','pv-press')}</div><div class="pv-statusrow"><span>Rest</span><span>Hover</span><span>Press</span></div>`,
 M05:`<div class="pv-magnetzone"><span class="pv-boundary"></span>${block('Explore','pv-magnet')}<span class="pv-pointer">${pointer}</span></div><div class="pv-measure">Moving artwork / stable hit area</div>`,
 M06:`<div class="pv-perspective"><div class="pv-tilt"><span class="pv-tiltart"></span><b>Collection / 06</b><span>Perspective study</span></div></div>`,
 M07:`<div class="pv-morphrow"><span class="pv-shape"></span><span class="pv-transitionline"></span><span class="pv-shape pv-morph"></span></div><div class="pv-statusrow"><span>Square</span><span>Rounded state</span></div>`,
 M08:`<div class="pv-sharedscene"><div class="pv-smallview"><span class="pv-sharedsmall"></span><span>Collection</span></div><div class="pv-largeview"><span class="pv-sharedlarge"></span><b>Selected project</b><span>The same object changes context.</span></div></div>`,
 M09:`<div class="pv-tabs"><span>Brief</span><span class="pv-selected">Assets</span><span>Log</span></div><div class="pv-tabpanel"><b>Project assets</b>${line('Cover / Ready')}${line('Invite / In review')}</div>`,
 M10:`<div class="pv-accordion"><b>Project details <span>−</span></b><p>Three deliverables. One review round.<br>Deadline: Friday.</p><b>Production notes <span>+</span></b><b>Attachments <span>+</span></b></div>`,
 M11:`<div class="pv-depthscene"><span class="pv-depth pv-back">BACKGROUND</span><span class="pv-depth pv-mid">MIDDLE</span><span class="pv-depth pv-front">FOREGROUND</span></div><div class="pv-measure">Independent layer offsets</div>`,
 M12:`<div class="pv-story"><div class="pv-storytrack"><span>Start</span><span class="pv-selected">Develop</span><span>Resolve</span></div><div><b>Develop the idea.</b><p>Scroll progress selects the next chapter.</p><div class="pv-track"><i style="width:50%"></i></div></div></div>`,
 M13:`<div class="pv-wipetext">REVEAL<br>THE IDEA.</div><div class="pv-revealline"></div><div class="pv-measure">One directional mask</div>`,
 M14:`<div class="pv-type"><span>MAKE</span><span class="pv-kinetic">IT MOVE.</span></div><div class="pv-measure">A full phrase / readable hold</div>`,
 M15:`<div class="pv-carousel">${['A17','A23','A18'].map(id=>{const entry=find(id);return `<span>${imageHTML(entry.applied)}</span>`;}).join('')}</div><div class="pv-statusrow"><span>Previous</span><span>02 / 03</span><span>Next</span></div>`,
 M16:`<div class="pv-reorder">${line('1 / Brief')}${line('2 / References')}<div class="pv-droptarget">Drop here</div><div class="pv-dragging">3 / Artwork <span>${pointer}</span></div></div>`,
 M17:`<div class="pv-progress"><b>Importing references</b><div class="pv-track"><i class="pv-loading" style="width:72%"></i></div><span>72% / Processing images</span></div>${block('Cancel import','pv-outline')}`, 
 M18:`<div class="pv-state pv-success"><b>Project saved</b><span>Undo is available.</span></div><div class="pv-state pv-error"><b>Upload failed</b><span>Connection interrupted. Retry upload.</span></div>`,
 M19:`<div class="pv-exploded"><span>Label</span><span>Surface</span><span>Border</span><span>Shadow</span></div>`,
 M20:`<div class="pv-breathe"><span></span></div><div class="pv-measure">Slow cycle / pause at any time</div>`
 };
 if(!templates[e.id]){if(window.NewStyles&&/^S(1[3-9]|2[0-2])$/.test(e.id))return NewStyles.tile(e,false);if(/^S(1[3-9]|2[0-2])$/.test(e.id))return `<div class="styleTile" data-pending-style="${e.id}"></div>`;throw Error('Missing specimen preview: '+e.id);}
 return `<div class="specimen-preview" data-preview="${e.id}" role="img" aria-label="${esc(e.title)} component example"><div class="pv-stage">${templates[e.id]}</div><span class="pv-caption">${e.id[0]==='M'?'Motion specimen / open to play':'Component specimen'}</span></div>`;
 }
};
