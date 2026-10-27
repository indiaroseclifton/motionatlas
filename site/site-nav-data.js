'use strict';
/* The atlas navigation: groups, items, one-line purposes and the film that previews each. Single source for atlas-nav.js
   (atlas.html) and site-bar.js (every other page). Item: [href, name, note, film]. */
window.ATLAS_NAV_GROUPS=[
  {name:'Explore',items:[
   ['#home','Home','The atlas at a glance, with the jellyfish reel.','jellyfish'],
   ['#browse','Catalogue','Every specimen in one searchable contact sheet.','hydraulic-erosion'],
   ['#tours','Guided tours','Short routes through the atlas for a brief or a mood.','golden-dove'],
   ['#compare','Compare styles','Two styles side by side on the same subject.','ferrofluid'],
   ['#references','Sources & credits','Original works, research, licences and credits.','smoke-plume']]},
  {name:'Visual',items:[
   ['#art','Art styles','Sixty art styles, from museum references to procedural specimen films.','suminagashi'],
   ['#cinema','Film looks','Cinematic directions translated into original scenes.','pixel-sorting'],
   ['#backgrounds','Backgrounds','Generate gradients, light and grain; export 4K or a loop.','petal-swirl'],
   ['#vases','Vase studies','One vase, forty treatments, to read a style quickly.','sand-drawing'],
   ['#pairings','Style pairings','Styles that work together, and why.','lion-phoenix']]},
  {name:'Motion',items:[
   ['#motion','Animation studio','Live studies, films, simulations and an easing lab.','bioluminescent-trails'],
   ['#effects','Landing effects','The techniques: scroll-driven CSS, View Transitions, shaders, with code.','light-ribbons'],
   ['#showcase','Showcase reels','Motion templates for portfolios and launches.','golden-figure']]},
  {name:'Interface',items:[
   ['#systems','Design systems','Forty-eight complete visual worlds and real open-source systems.','game-of-life'],
   ['#ux','UI components','Sixty-four components, every state, in every style.','light-mesh'],
   ['#icons','Icon families','Outline, solid, pixel, colour and 3D icon sets.','sketchbook-horse'],
   ['icons.html','Icon library','3,768 searchable icons in 13 families, with full packs.','sketchbook-horse'],
   ['#typography','Fonts & type','Type pairings and scales, ready to use.','light-threads'],
   ['#playground','System playground','Try a system across a landing page, dashboard and phone.','swan-construction'],
   ['#assets','Extracted assets','201 fragments cut from our original mock-ups.','paper-bird'],
   ['theme-kits.html','Theme kits','Forty-eight kits, Matrix to Graphite: tokens, components, backgrounds and assets.','game-of-life'],
   ['ds/start.html','01 Design System docs','The 01 design system, documented: foundations, components, patterns and downloads.','game-of-life'],
   ['chart-styles.html','Chart style guides','Chart palettes and rules for every style.','game-of-life']]},
  {name:'Make',items:[
   ['tools.html','All tools','Every tool in one place, with what it makes and how they connect.','paper-bird'],
   ['page-builder.html','Site builder','Multi-page sites from 26 templates, 56 sections and 82 photographs; export or publish.','paper-bird'],
   ['brand-generator.html','Brand kit generator','Name and feel words in; palette, fonts, logo lockups, tokens and a theme kit out.','game-of-life'],
   ['flowchart-studio.html','Flowcharts','Draw, animate and export flowcharts; the lighter canvas editor is one menu away inside.','light-mesh'],
   ['chart-studio.html','Chart studio','Your data as a chart: 26 forms, any style.','pigment-bloom'],
   ['mockup-studio.html','Mockup studio','Frame a screenshot in a device and export every social size.','paper-bird'],
   ['diagram-studio.html','Diagram studio','Eighteen diagram types: roadmaps to sequence and ER.','swan-construction'],
   ['particle-studio.html','Particle studio','Turn any picture into moving particles and export one HTML file.','particle-tree'],
   ['interactions.html','Interactions shelf','Seventy showpieces, scroll stories and sections to copy.','golden-dove']]},
  {name:'Your studio',items:[
   ['#projects','My projects','Save specimens into boards for a client or idea.','particle-tree'],
   ['moodboard.html','Moodboards','A free canvas: pin styles, kits, colours and pictures, then make a style.','embroidery'],
   ['#inspiration','Inspiration','Your own uploads and references, kept together.','embroidery'],
   ['my-fonts.html','My fonts','Fonts you own, kept in this browser and never uploaded.','embroidery'],
   ['#creations','Your creations','Things you have made and exported here.','pigment-bloom'],
   ['account.html','Account','Sign in, and keep your projects on every device.','particle-tree']]}
];

/* The menus the bar, the phone sheet and the no-JS row are built from. Items are looked up by href in ATLAS_NAV_GROUPS above
   (name, one-line purpose); a group is {name, items:[href|{more:name, items:[href]}]}. Keep each menu to about seven rows;
   anything rarer goes in a {more} row that expands in place. */
window.ATLAS_NAV_MENUS=[
 {id:'lib',name:'Library',groups:[
  {name:'Explore',items:['#home','#browse','#tours','#compare','#references']},
  {name:'Visual',items:['#art','#cinema','#backgrounds','#vases','#pairings']},
  {name:'Motion',items:['#motion','#effects','#showcase']},
  {name:'Interface',items:['#systems','#ux','theme-kits.html','icons.html','#typography','ds/start.html',{more:'More interface',items:['#icons','#playground','#assets','chart-styles.html']}]}]},
 {id:'make',name:'Make',top:['page-builder.html'],groups:[
  {name:'Brand & assets',items:['brand-generator.html','mockup-studio.html','theme-kits.html']},
  {name:'Charts & diagrams',items:['chart-studio.html','diagram-studio.html','flowchart-studio.html']},
  {name:'Motion & interaction',items:['particle-studio.html','interactions.html']}]},
 {id:'studio',name:'Your studio',groups:[
  {name:'',items:['#projects','moodboard.html','#inspiration','my-fonts.html','#creations','account.html']}]}
];
