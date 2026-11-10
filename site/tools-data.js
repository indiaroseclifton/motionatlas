'use strict';
/* One registry of every tool in the atlas. Read by tools.html (the overview), tools-menu.js (the "Tools" menu on
   every tool page), the atlas search and tools/site-qa.mjs (which checks every entry has a page, a thumbnail and a nav entry).
   Blurbs may carry {tokens}; they are filled from counts.json (made by tools/site-counts.mjs) so the numbers never go stale.
   Fallback numbers below are used only if counts.json cannot be read. */
(()=>{
 const FALLBACK={siteTemplates:26,siteSections:56,photos:82,icons:3768,iconFamilies:13,kits:48,systems:48,components:70,effects:41,interactions:109,chartTypes:26,diagramTypes:18,flowTemplates:24,devices:8,backgrounds:80,animationStudies:74,tours:6,entries:387,motionGraphics:28,appScreens:8};
 const TOOLS=[
  {id:'site-builder',group:'Make',name:'Site builder',href:'page-builder.html',film:'paper-bird',
   blurb:'Build a multi-page site from {siteTemplates} templates, {siteSections} sections and {photos} photographs; export HTML or publish it.'},
  {id:'brand-generator',group:'Make',name:'Brand kit generator',href:'brand-generator.html',film:'game-of-life',
   blurb:'Name and feel words in; palette, fonts, logo lockups, tokens and a theme kit out. Send it on to the Site builder.'},
  {id:'mockup-studio',group:'Make',name:'Mockup studio',href:'mockup-studio.html',film:'paper-bird',
   blurb:'Frame a screenshot in one of {devices} devices and export every social size.'},
  {id:'chart-studio',group:'Make',name:'Chart studio',href:'chart-studio.html',film:'pigment-bloom',
   blurb:'Paste your data and get a chart: {chartTypes} forms, any atlas style, checked for accessibility.'},
  {id:'diagram-studio',group:'Make',name:'Diagram studio',href:'diagram-studio.html',film:'swan-construction',
   blurb:'{diagramTypes} diagram types, from roadmaps and Gantt charts to sequence and ER diagrams.'},
  {id:'flowchart-studio',group:'Make',name:'Flowchart studio',href:'flowchart-studio.html',film:'light-mesh',
   blurb:'Draw, animate and export flowcharts, from {flowTemplates} starter charts or from scratch.'},
  {id:'flowchart-canvas',group:'Make',name:'Flowchart canvas',href:'flowchart-canvas.html',film:'light-mesh',
   blurb:'The lighter, text-first flowchart editor: write the flow, then drag and connect on the canvas. It opens the same chart as the Flowchart studio.'},
  {id:'motion-graphics',group:'Make',name:'Motion graphics studio',href:'motion-graphics.html',film:'light-ribbons',
   blurb:'Make video: {motionGraphics} animated titles, lower thirds, logo stings and transitions. Edit the words and colours, then export video, GIF or HTML.'},
  {id:'app-interfaces',group:'Make',name:'App interfaces',href:'app-interfaces.html',film:'light-mesh',
   blurb:'{appScreens} finished app and tool screens: dashboards, data tables, boards, inboxes, chat and settings. Light and dark, one HTML file each.'},
  {id:'interactions',group:'Make',name:'UI interactions',href:'interactions.html',film:'golden-dove',
   blurb:'{interactions} modern interactions to embed in sites and apps. Tune the new ones with live sliders, then copy one HTML file with your settings baked in.'},
  {id:'backgrounds',group:'Make',name:'Background generator',href:'atlas.html#backgrounds',film:'petal-swirl',
   blurb:'Gradients, light and grain: {backgrounds} backgrounds you can tune and export at 4K or as a loop.'},
  {id:'effects',group:'Library',name:'Landing effects lab',href:'atlas.html#effects',film:'light-ribbons',
   blurb:'The technique library: {effects} scroll and page effects running live, with tunable settings and copyable code. Come here to learn how an effect is built.'},
  {id:'components',group:'Library',name:'Component lab',href:'atlas.html#ux',film:'light-mesh',
   blurb:'{components} components in every state and every style, with HTML, CSS, React and token export.'},
  {id:'theme-kits',group:'Library',name:'Theme kits',href:'theme-kits.html',film:'game-of-life',
   blurb:'{kits} kits, Matrix to Graphite: tokens, components, backgrounds and assets, ready to download.'},
  {id:'icon-library',group:'Library',name:'Icon library',href:'icons.html',film:'sketchbook-horse',
   blurb:'{icons} searchable icons in {iconFamilies} families, with full packs and SVG, PNG and React export.'},
  {id:'chart-styles',group:'Library',name:'Chart style guides',href:'chart-styles.html',film:'game-of-life',
   blurb:'Chart palettes, type and rules for every atlas style.'},
  {id:'motion',group:'Library',name:'Animation studio',href:'atlas.html#motion',film:'bioluminescent-trails',
   blurb:'Watch and study: {animationStudies} live animations, films and simulations, plus an easing lab for tuning curves.'},
  {id:'projects',group:'Your studio',name:'My projects',href:'atlas.html#projects',film:'particle-tree',
   blurb:'Save specimens, kits, sites and boards into a project for a client or an idea.'},
  {id:'moodboard',group:'Your studio',name:'Moodboards',href:'moodboard.html',film:'embroidery',
   blurb:'A free canvas: pin styles, theme kits, icons, colours and pictures, then make a style from the board.'},
  {id:'inspiration',group:'Your studio',name:'Inspiration',href:'atlas.html#inspiration',film:'embroidery',
   blurb:'Your own uploads and references, kept together.'},
  {id:'creations',group:'Your studio',name:'Your creations',href:'atlas.html#creations',film:'pigment-bloom',
   blurb:'Things you have made and exported here.'}
 ];
 const fill=(s,c)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>{const v=(c&&c[k]!=null)?c[k]:FALLBACK[k];return v==null?m:Number(v).toLocaleString('en-US')});
 let cache=null;
 const counts=()=>cache||(cache=fetch('counts.json',{cache:'no-cache'}).then(r=>r.ok?r.json():FALLBACK).catch(()=>FALLBACK));
 window.ATLAS_TOOLS={list:TOOLS,groups:['Make','Library','Your studio'],counts,fill,fallback:FALLBACK,
  thumb:t=>'assets/tools/'+t.id+'.jpg',
  /* blurb with live numbers; resolves to a string */
  blurb:t=>counts().then(c=>fill(t.blurb,c)),
  /* synchronous version with the fallback numbers (for places that cannot wait) */
  blurbNow:t=>fill(t.blurb,FALLBACK)};
})();
